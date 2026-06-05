import config from '@adonisjs/core/services/config';
import { errors, HttpContext } from '@adonisjs/core/http';
import Index from '../models/index.js';
import Story from '../models/story.js';
import StoryLocalisation, { emptyTranslation } from '../models/story_localisation.js';
import type {
  CmsConfig,
  FieldSpec,
  StoryEditProps,
  StoryIndexItem,
  StorySpec,
  StoryVersion,
  Providers,
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

  public async editProps(ctx: HttpContext): Promise<StoryEditProps | undefined> {
    const params = this.paramsFromPath(ctx);
    if (!params) return undefined;

    const sourceLocale = this.config.languages[0].locale;
    const { storyId, locale } = params;

    const story = await Story.query()
      .where('id', storyId)
      .preload('localisations', (localisationsQuery) => {
        localisationsQuery.whereIn('locale', [locale, sourceLocale]);
      })
      .first();

    if (!story) return undefined;

    const hasNoContent = await this.hasNoContent(storyId);

    const target =
      story.localisations.find((localisation) => localisation.locale === locale) ??
      emptyTranslation;
    const source =
      story.localisations.find((localisation) => localisation.locale === sourceLocale) ??
      emptyTranslation;

    return {
      model: {
        id: story.id,
        tags: story.tags ?? null,
        chapterLimit: story.chapterLimit,
        storyType: story.storyType,
        chapterType: story.chapterType,
        sectionType: story.sectionType ?? null,
        visibility: story.visibility,
        slug: story.slug,
        template: story.template,
        isPublished: story.isPublished,
        createdAt: story.createdAt.toISO()!,
        updatedAt: story.updatedAt.toISO()!,
        ...this.localisationFields(target),
      },
      source: this.localisationFields(source),
      isNew: hasNoContent,
      providers: config.get<Providers>('providers')!,
    };
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

    const sourceModels = await StoryLocalisation.query().where(
      'locale',
      this.config.languages[0].locale,
    );

    const storyModels = await Story.query()
      .preload('localisations', (localisationsQuery) => {
        localisationsQuery.where('locale', locale);
      })
      .orderBy('order', 'asc');

    return storyModels.map((story) => {
      const local = story.localisations[0] ?? emptyTranslation;
      const index = indices.find((i) => i.storyId === story.id);
      const source = sourceModels.find((m) => m.storyId === story.id);

      return {
        id: story.id,
        name: local.title || (source?.title ?? ''),
        description: local.description ?? '',
        coverImage: local.coverImage || (source?.coverImage ?? ''),
        chapterLimit: story.chapterLimit,
        isPublished: story.isPublished,
        createdAt: story.createdAt?.toISO() ?? '',
        updatedAt: story.updatedAt?.toISO() ?? '',
        draftCount: index?.draftsList.length ?? 0,
      };
    });
  }

  private async hasNoContent(id: number): Promise<boolean> {
    const index = await Index.query().where('storyId', id).first();
    if (index === null) return true;
    if (index.draftsList.length > 0) return false;
    if (index.publishedList.length > 0) return false;

    return true;
  }

  // TODO: test
  private async storyFromQuery(ctx: HttpContext): Promise<Story | undefined> {
    const storyId = ctx.request.qs()['storyId'];
    const locale = ctx.request.qs()['locale'] || this.config.languages[0].locale;

    const query = Story.query().preload('localisations', (localisationsQuery) => {
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

  private localisationFields(local: {
    title?: string;
    coverImage?: string;
    description?: string;
    sections?: StoryEditProps['model']['sections'];
    resources?: string[];
  }): Pick<
    StoryEditProps['model'],
    'title' | 'coverImage' | 'description' | 'sections' | 'resources'
  > {
    return {
      title: local.title ?? '',
      coverImage: local.coverImage ?? '',
      description: local.description ?? '',
      sections: local.sections ?? [],
      resources: local.resources ?? [],
    };
  }

  protected fieldsFromTemplate(id: string): FieldSpec[] {
    const allTemplates = [...this.config.bespokeTemplates, ...this.config.storyTemplates];
    const template = allTemplates.find((t) => t.id === id);
    if (!template) return [];

    return template.fields;
  }
}
