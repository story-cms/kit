import db from '@adonisjs/lucid/services/db';
import { IndexService } from './index_service.js';
import { inject } from '@adonisjs/core';
import { CmsService } from './cms_service.js';

@inject()
export class AdminService {
  constructor(protected cms: CmsService) {}
  protected _feedback: string[] = [];

  /**
   * Builds all the indexes freshly from the published chapters
   */
  public async rebuildIndexes() {
    const defaultStory = this.cms.config.stories.stories[0];
    const service = new IndexService(defaultStory, this.cms);
    this._feedback = [];

    for (const language of this.cms.config.languages.languages) {
      for (const story of this.cms.config.stories.stories) {
        service.story = story;
        await service.buildIndex({
          apiVersion: 1,
          locale: language.locale,
          storyId: story.id,
        });
        this._feedback.push(`${language.language} - ${story.name}`);
      }
    }
  }

  /**
   * Synchronize the sequential increment number of an autoincrement field after a data import.
   */
  public async syncAutoIncrement() {
    const tables = [
      'chapters',
      'indices',
      'drafts',
      'users',
      'pages',
      'uis',
      'ui_attributes',
    ];

    for (const table of tables) {
      await this.syncAutoIncrementFor(table);
    }
  }

  protected async syncAutoIncrementFor(table: string) {
    const maxIdResult = await db.rawQuery(`SELECT (MAX(id) + 1) as nr FROM ${table}`);
    const maxId = maxIdResult.rows[0]['nr'];

    const nextLevelResult = await db.rawQuery(
      `SELECT nextval('public.${table}_id_seq') as nr`,
    );
    const nextLevel = Number.parseInt(nextLevelResult.rows[0]['nr'], 10);
    const targetLevel = maxId;
    if (targetLevel === nextLevel) {
      this._feedback.push(`Autoincrement on ${table} table is already synchronized.`);
      return;
    }
    await db.rawQuery(`SELECT SETVAL('public.${table}_id_seq', ?, FALSE)`, [targetLevel]);
    this._feedback.push(
      `Autoincrement on ${table} table synchronized to ${targetLevel}.`,
    );
  }

  public get feedback() {
    return this._feedback;
  }
}
