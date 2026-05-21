import { errors, HttpContext } from '@adonisjs/core/http';
import Index from '../models/index.js';
import Story from '../models/story.js';
import { emptyTranslation } from '../models/story_localisation.js';
import type {
  CmsConfig,
  FieldSpec,
  StoryIndexItem,
  StorySpec,
  StoryVersion,
} from '../../types.js';

export class StoryService {
  public constructor(protected readonly config: CmsConfig) {}

  public paramsFromPath(
    ctx: HttpContext,
  ): { storyId: number; locale: string } | undefined {
    if (!ctx.auth.use('web')?.user?.isAllowed(ctx.params.locale)) {
      throw errors.E_ROUTE_NOT_FOUND;
    }

    return { storyId: Number.parseInt(ctx.params.storyId), locale: ctx.params.locale };
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

    if (!story) return { story: undefined, version };

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

    const spec = this.specFrom(story);

    return { story: spec, version };
  }

  public async galleryIndex(ctx: HttpContext): Promise<StoryIndexItem[]> {
    if (!ctx.auth.use('web')?.user?.isAllowed(ctx.params.locale)) {
      throw errors.E_ROUTE_NOT_FOUND;
    }

    const locale = ctx.params.locale;
    const indices = await Index.query().where('locale', locale);

    const storyModels = await Story.query()
      .preload('localisations', (localisationsQuery) => {
        localisationsQuery.where('locale', locale);
      })
      .orderBy('order', 'asc');

    return storyModels.map((story) => {
      const local = story.localisations[0] ?? emptyTranslation;
      const index = indices.find((i) => i.storyId === story.id);

      return {
        id: story.id,
        name: local.title,
        description: local.description,
        coverImage: local.coverImage,
        chapterLimit: story.chapterLimit,
        isPublished: story.isPublished,
        createdAt: story.createdAt.toISO()!,
        updatedAt: story.updatedAt.toISO()!,
        draftCount: index?.draftsList.length ?? 0,
      };
    });
  }

  // TODO: test
  private async storyFromQuery(ctx: HttpContext): Promise<Story | undefined> {
    const storyId = ctx.request.qs()['storyId'];
    const locale = ctx.request.qs()['locale'] || this.config.languages[0].locale;

    let query = Story.query().preload('localisations', (localisationsQuery) => {
      localisationsQuery.where('locale', locale);
    });

    if (storyId !== undefined) {
      const story = await query.where('id', storyId).first();
      if (story !== null) return story;
    }

    let storylabel = ctx.request.qs()['story'];
    if (storylabel !== undefined) {
      storylabel = storylabel.toLowerCase();
      const story = await query.where('slug', storylabel).first();

      if (story !== null) return story;
    }

    return undefined;
  }

  private async storyFromPath(ctx: HttpContext): Promise<StorySpec | undefined> {
    const storyId = Number.parseInt(ctx.params.storyId);
    const story = await Story.query()
      .where('id', storyId)
      .preload('localisations', (localisationsQuery) => {
        localisationsQuery.where('locale', ctx.params.locale);
      })
      .first();
    if (!story) return undefined;

    return this.specFrom(story);
  }

  protected specFrom(story: Story): StorySpec {
    const localisation = story.localisations[0] ?? emptyTranslation;
    return {
      id: story.id,
      name: localisation.title,
      coverImage: localisation.coverImage,
      chapterLimit: story.chapterLimit,
      chapterType: story.chapterType,
      storyType: story.storyType,
      schemaVersion: 1,
      fields: this.fieldsFromTemplate(story.template),
      sections: localisation.sections,
    };
  }

  protected fieldsFromTemplate(id: string): FieldSpec[] {
    const allTemplates = [...this.config.bespokeTemplates, ...this.config.storyTemplates];
    const template = allTemplates.find((t) => t.id === id);
    if (!template) return [];

    return template.fields;
  }
}
