import config from '@adonisjs/core/services/config';
import { errors, HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import StoryDeleteException from '../exceptions/story_delete_exception.js';
import Chapter from '../models/chapter.js';
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
  StoryCreateProps,
} from '../../types.js';
import Draft from '../models/draft.js';
import { slugify } from './helpers.js';
import { ResourceService } from './resource_service.js';

export class StoryService {
  public constructor(
    protected readonly config: CmsConfig,
    protected readonly resourceService = new ResourceService(),
  ) {}

  public paramsFromPath(
    ctx: HttpContext,
  ): { storyId: number; locale: string } | undefined {
    if (!ctx.auth.use('web')?.user?.isAllowed(ctx.params.locale)) {
      throw errors.E_ROUTE_NOT_FOUND;
    }

    return { storyId: Number.parseInt(ctx.params.storyId), locale: ctx.params.locale };
  }

  public async blockingPublishMessages(story: Story): Promise<string[]> {
    // return ['Story not found.', 'Story is published.', 'Story has content.'];
    const collected: string[] = [];
    // source language chapter count
    const sourceChapters = await Chapter.query()
      .where('storyId', story.id)
      .where('locale', this.config.languages[0].locale);
    const missingChapters = story.chapterLimit - (sourceChapters?.length ?? 0);
    if (missingChapters > 0)
      collected.push(
        `You need to add ${missingChapters} more ${story.chapterType}s to your ${story.storyType}.`,
      );

    return collected;
  }

  async blockingDeleteMessages(storyId: number): Promise<string[]> {
    // return ['Story not found.', 'Story is published.', 'Story has content.'];
    const collected: string[] = [];
    const story = await Story.query().where('id', storyId).first();
    if (!story) collected.push('Story not found.');
    if (story?.isPublished) collected.push('Story is published.');

    const chapters = await Chapter.query().where('storyId', storyId);
    if (chapters.length > 0) collected.push('Story has published chapters.');

    return collected;
  }

  public async delete(storyId: number) {
    const messages = await this.blockingDeleteMessages(storyId);
    if (messages.length > 0) throw new StoryDeleteException(messages);
    // cascade delete drafts, chapters and index
    await db.transaction(async (trx) => {
      await Draft.query({ client: trx }).where('storyId', storyId).delete();
      await Chapter.query({ client: trx }).where('storyId', storyId).delete();
      await Index.query({ client: trx }).where('storyId', storyId).delete();
      await StoryLocalisation.query({ client: trx }).where('storyId', storyId).delete();
      await Story.query({ client: trx }).where('id', storyId).delete();
    });
  }

  public async createProps(ctx: HttpContext): Promise<StoryCreateProps | undefined> {
    // ready?
    if (!this.config.storyTemplates.length) return undefined;
    const params = this.paramsFromPath(ctx);
    if (params?.locale !== this.config.languages[0].locale) return undefined;

    // set
    const template = this.config.storyTemplates[0].id;

    const firstLocalisation = await StoryLocalisation.query()
      .where('locale', this.config.languages[0].locale)
      .first();

    const target = firstLocalisation
      ? {
          ...emptyTranslation,
          coverImage: firstLocalisation?.coverImage,
        }
      : emptyTranslation;

    // go!
    return {
      model: {
        chapterLimit: 10,
        storyType: 'Story',
        chapterType: 'Chapter',
        sectionType: null,
        visibility: 'public',
        slug: null,
        template,
        ...this.localisationFields(target),
      },
      templates: this.config.storyTemplates,
      providers: config.get<Providers>('providers')!,
    };
  }

  public async uniqueSlug(title: string): Promise<string> {
    const slug = slugify(title);
    const story = await Story.query().where('slug', slug).first();
    if (story)
      return this.uniqueSlug(title + '-' + Math.random().toString(36).substring(2, 15));
    return slug;
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

    const availableResources = await this.resourceService.listByLocale(locale);
    const targetResources = await this.resourceService.hydrate(target.resources ?? []);

    let sourceSection = {};
    if (locale !== sourceLocale) {
      const source =
        story.localisations.find(
          (localisation) => localisation.locale === sourceLocale,
        ) ?? emptyTranslation;
      const sourceResources = await this.resourceService.hydrate(source.resources ?? []);
      sourceSection = {
        source: {
          ...this.localisationFields(source),
          resources: sourceResources,
        },
      };

      target.coverImage = source.coverImage;
    }

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
        ...this.localisationFields(target),
        resources: targetResources,
      },
      ...sourceSection,
      availableResources,
      hasNoContent,
      providers: config.get<Providers>('providers')!,
    };
  }

  public async updateResources(
    storyId: number,
    locale: string,
    resourceIds: string[],
  ): Promise<void> {
    await this.resourceService.updateStoryResources(storyId, locale, resourceIds);
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

  public specFrom(story: Story): StorySpec {
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

  private localisationFields(local: {
    title?: string | null;
    coverImage?: string | null;
    description?: string | null;
    tags?: string | null;
    sections?: StoryEditProps['model']['sections'] | null;
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
