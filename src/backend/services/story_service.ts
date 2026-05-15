import { errors, HttpContext } from '@adonisjs/core/http';
import type { CmsConfig, FieldSpec, StorySpec, StoryVersion } from '../../types.js';
import Story from '../models/story.js';
import StoryLocalisation from '../models/story_localisation.js';

export class StoryService {
  public constructor(protected readonly config: CmsConfig) {}

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

  public async parseQuery(ctx: HttpContext): Promise<
    | {
        story: StorySpec;
        version: StoryVersion;
      }
    | undefined
  > {
    const story = await this.storyFromQuery(ctx);
    if (!story) return undefined;

    const version = <StoryVersion>{
      apiVersion: 1,
      locale: ctx.request.qs()['locale'] || this.config.languages[0].locale,
      storyId: story.id,
    };

    const localisation = await StoryLocalisation.query()
      .where('storyId', story.id)
      .where('locale', version.locale)
      .first();
    if (!localisation) return undefined;

    const spec = this.specFromStory(story, localisation);

    return { story: spec, version };
  }

  private async storyFromQuery(ctx: HttpContext): Promise<Story | undefined> {
    const storyId = ctx.request.qs()['storyId'];
    if (storyId !== undefined) {
      const story = await Story.query().where('id', storyId).first();
      if (story !== null) return story;
    }

    let storylabel = ctx.request.qs()['story'];
    if (storylabel !== undefined) {
      storylabel = storylabel.toLowerCase();
      const story = await Story.query().where('slug', storylabel).first();

      if (story !== null) return story;
    }

    return undefined;
  }

  private async storyFromPath(ctx: HttpContext): Promise<StorySpec | undefined> {
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
