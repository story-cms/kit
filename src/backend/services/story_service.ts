import configService from '@adonisjs/core/services/config';
import { errors, type HttpContext } from '@adonisjs/core/http';
import Index from '../models/index.js';
import Story from '../models/story.js';
import StoryLocalisation, { emptyTranslation } from '../models/story_localisation.js';
import { ResourceService } from './resource_service.js';
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

    const resourceService = new ResourceService();
    const availableResources = await resourceService.listByLocale(locale);
    const targetFields = this.localisationFields(target);
    const sourceFields = this.localisationFields(source);

    return {
      model: {
        id: story.id,
        chapterLimit: story.chapterLimit,
        storyType: story.storyType,
        chapterType: story.chapterType,
        sectionType: story.sectionType ?? null,
        visibility: story.visibility,
        slug: story.slug,
        template: story.template,
        isPublished: story.isPublished,
        ...targetFields,
        resources: await resourceService.hydrate(this.resourceIds(target)),
      },
      source: {
        ...sourceFields,
        resources: await resourceService.hydrate(this.resourceIds(source)),
      },
      availableResources,
      hasNoContent,
      providers: configService.get<Providers>('providers')!,
    };
  }

  public async updateResources(
    storyId: number,
    locale: string,
    resourceIds: string[],
  ): Promise<void> {
    await new ResourceService().updateStoryResources(storyId, locale, resourceIds);
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

  private async storyFromQuery(ctx: HttpContext): Promise<Story | undefined> {
    const qs = ctx.request.qs();
    const storyId = qs['storyId'];
    const storySlug = qs['story'];
    const locale = qs['locale'] || this.config.languages[0].locale;

    const baseQuery = () =>
      Story.query()
        .orderBy('id', 'asc')
        .preload('localisations', (localisationsQuery) => {
          localisationsQuery.where('locale', locale);
        });

    if (storyId !== undefined) {
      const story = await baseQuery().where('id', storyId).first();
      return story ?? undefined;
    }

    if (storySlug !== undefined) {
      const story = await baseQuery().where('slug', storySlug.toLowerCase()).first();
      return story ?? undefined;
    }

    const story = await baseQuery().first();
    return story ?? undefined;
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
      coverImage: localisation.coverImage ?? '',
      chapterLimit: story.chapterLimit,
      chapterType: story.chapterType,
      storyType: story.storyType,
      schemaVersion: 1,
      fields: this.fieldsFromTemplate(story.template),
      sections: localisation.sections,
    };
  }

  private resourceIds(local: { resources?: string[] }): string[] {
    return local.resources ?? [];
  }

  private localisationFields(local: {
    title?: string;
    coverImage?: string | null;
    description?: string | null;
    tags?: string | null;
    sections?: StoryEditProps['model']['sections'];
  }): Pick<
    StoryEditProps['model'],
    'title' | 'coverImage' | 'description' | 'tags' | 'sections'
  > {
    return {
      title: local.title ?? '',
      coverImage: local.coverImage ?? '',
      description: local.description ?? '',
      tags: local.tags ?? null,
      sections: local.sections ?? [],
    };
  }

  protected fieldsFromTemplate(id: string): FieldSpec[] {
    const allTemplates = [...this.config.bespokeTemplates, ...this.config.storyTemplates];
    const template = allTemplates.find((t) => t.id === id);
    if (!template) return [];

    return template.fields;
  }
}
