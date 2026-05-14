import { errors, HttpContext } from '@adonisjs/core/http';
import type { CmsConfig, FieldSpec, StorySpec, StoryVersion } from '../../types';
import Story from '../models/story';
import StoryLocalisation from '../models/story_localisation';

export default class StoryService {
  public constructor(protected readonly config: CmsConfig) {}

  public async storyFromPath(ctx: HttpContext): Promise<StorySpec | undefined> {
    const storyId = Number.parseInt(ctx.params.storyId);
    const story = await Story.query().where('id', storyId).first();
    if (!story) return undefined;

    const localisation = await StoryLocalisation.query()
      .where('storyId', storyId)
      .where('locale', ctx.params.locale)
      .first();
    if (!localisation) return undefined;

    return this.specFromStory(story, localisation);
  }

  public async parsePath(ctx: HttpContext): Promise<{
    story: StorySpec | undefined;
    version: StoryVersion;
  }> {
    if (!ctx.auth.use('web')?.user?.isAllowed(ctx.params.locale)) {
      throw errors.E_ROUTE_NOT_FOUND;
    }

    const story = await this.storyFromPath(ctx);

    const version = <StoryVersion>{
      apiVersion: 1,
      locale: ctx.params.locale,
      storyId: story?.id,
    };
    return { story, version };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async parseQuery(_: HttpContext): Promise<{
    story: StorySpec | undefined;
    version: StoryVersion;
  }> {
    throw new Error('Not implemented');
    // if (this.#config.stories.length === 0) return undefined;

    // const defaultStory = this.#config.stories[0];

    // const storyId = ctx.request.qs()['storyId'];
    // if (storyId !== undefined) {
    //   const story = this.#config.stories.find((s) => s.id === Number(storyId));
    //   if (story !== undefined) return story;
    // }

    // let storylabel = ctx.request.qs()['story'];
    // if (storylabel !== undefined) {
    //   storylabel = storylabel.toLowerCase();
    //   const story = this.#config.stories.find(
    //     (s) => s.name.toLocaleLowerCase() === storylabel,
    //   );
    //   if (story !== undefined) return story;
    // }

    // return defaultStory;
  }

  protected specFromStory(story: Story, localisation: StoryLocalisation): StorySpec {
    return {
      id: story.id,
      name: localisation.title,
      coverImage: localisation.coverImage,
      chapterLimit: story.chapterLimit,
      chapterType: story.chapterType,
      storyType: story.storyType,
      schemaVersion: 1,
      fields: this.fieldsFromTemplate(story.template),
      // TODO: from localisation.sections
      parts: [],
    };
  }

  protected fieldsFromTemplate(id: string): FieldSpec[] {
    const allTemplates = [...this.config.bespokeTemplates, ...this.config.storyTemplates];
    const template = allTemplates.find((t) => t.id === id);
    if (!template) return [];

    return template.fields;
  }
}
