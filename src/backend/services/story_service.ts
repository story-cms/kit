import configService from '@adonisjs/core/services/config';
import { errors, type HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import { randomUUID } from 'node:crypto';
import Chapter from '../models/chapter.js';
import Draft from '../models/draft.js';
import Index from '../models/index.js';
import Story from '../models/story.js';
import StoryLocalisation, { emptyTranslation } from '../models/story_localisation.js';
import StoryDeleteException from '../exceptions/story_delete_exception.js';
import {
  slugify,
  storyDetailsBlockedMessages,
  publishBlockedMessage,
  storyTypeBlockedMessages,
  type StoryPublishMetadata,
} from './helpers.js';
import { ResourceService } from './resource_service.js';
import type {
  BundleTemplate,
  CmsConfig,
  FieldSpec,
  StoryCreateProps,
  StoryEditProps,
  StoryIndexItem,
  StorySection,
  StorySpec,
  StoryUpdatePayload,
  StoryVersion,
  Providers,
  ResourceItem,
} from '../../types.js';

export type PostedSection = {
  id?: string;
  title: string;
  description?: string;
};

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

  public async blockingPublishMessages(
    story: Story,
    metadata?: StoryPublishMetadata,
    locale?: string,
  ): Promise<string[]> {
    const publishLocale = locale ?? this.config.languages[0].locale;
    const localeChapters = await Chapter.query()
      .where('storyId', story.id)
      .where('locale', publishLocale);

    const messages: string[] = [];

    messages.push(
      ...storyTypeBlockedMessages(
        metadata?.storyType ?? story.storyType,
        metadata?.chapterType ?? story.chapterType,
      ),
    );

    const chapterMessage = publishBlockedMessage(
      localeChapters?.length ?? 0,
      story.chapterLimit,
      metadata?.chapterType ?? story.chapterType,
      metadata?.storyType ?? story.storyType,
    );
    if (chapterMessage) messages.push(chapterMessage);

    if (metadata) {
      messages.push(...storyDetailsBlockedMessages(metadata));
    }

    return messages;
  }

  async blockingDeleteMessages(storyId: number): Promise<string[]> {
    const collected: string[] = [];
    const story = await Story.query().where('id', storyId).first();
    if (!story) collected.push('Story not found.');

    const publishedLocalisation = await StoryLocalisation.query()
      .where('storyId', storyId)
      .where('isPublished', true)
      .first();
    if (publishedLocalisation || story?.isPublished) {
      collected.push('Story is published.');
    }

    const chapters = await Chapter.query().where('storyId', storyId);
    if (chapters.length > 0) collected.push('Story has published chapters.');

    return collected;
  }

  public async delete(storyId: number) {
    const messages = await this.blockingDeleteMessages(storyId);
    if (messages.length > 0) throw new StoryDeleteException(messages);
    await db.transaction(async (trx) => {
      await Draft.query({ client: trx }).where('storyId', storyId).delete();
      await Chapter.query({ client: trx }).where('storyId', storyId).delete();
      await Index.query({ client: trx }).where('storyId', storyId).delete();
      await StoryLocalisation.query({ client: trx }).where('storyId', storyId).delete();
      await Story.query({ client: trx }).where('id', storyId).delete();
    });
  }

  public async createProps(ctx: HttpContext): Promise<StoryCreateProps | undefined> {
    if (!this.config.storyTemplates.length) return undefined;
    const params = this.paramsFromPath(ctx);
    if (params?.locale !== this.config.languages[0].locale) return undefined;

    const locale = params.locale;
    const template = this.config.storyTemplates[0].id;

    const target = { ...emptyTranslation };

    const resourceService = new ResourceService();
    const availableResources = await resourceService.listForLocale(locale);

    return {
      model: {
        chapterLimit: null,
        storyType: 'Story',
        chapterType: 'Chapter',
        sectionType: null,
        visibility: 'public',
        slug: null,
        template,
        ...this.localisationFields(target),
      },
      templates: this.config.storyTemplates,
      providers: configService.get<Providers>('providers')!,
      availableResources,
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

    const target = story.localisations.find(
      (localisation) => localisation.locale === locale,
    ) ?? { ...emptyTranslation };
    const source = story.localisations.find(
      (localisation) => localisation.locale === sourceLocale,
    ) ?? { ...emptyTranslation };

    if (locale !== sourceLocale && !target.coverImage) {
      target.coverImage = source.coverImage;
    }

    const resourceService = new ResourceService();
    const availableResources = await resourceService.listForLocale(locale);
    const targetFields = this.localisationFields(target);

    const props: StoryEditProps = {
      model: {
        id: story.id,
        chapterLimit: story.chapterLimit,
        storyType: story.storyType ?? null,
        chapterType: story.chapterType ?? null,
        sectionType: story.sectionType ?? null,
        visibility: story.visibility,
        slug: story.slug,
        template: story.template,
        isPublished: this.localisationIsPublished(target),
        ...targetFields,
        resources: await resourceService.hydrate(target.resources ?? []),
      },
      availableResources,
      hasNoContent,
      templates: this.templatesForEditDisplay(),
      providers: configService.get<Providers>('providers')!,
    };

    if (locale !== sourceLocale) {
      const sourceFields = this.localisationFields(source);
      props.source = {
        ...sourceFields,
        resources: await resourceService.hydrate(source.resources ?? []),
      };
    }

    return props;
  }

  public async buildUpdatePayload(
    storyId: number,
    locale: string,
  ): Promise<StoryUpdatePayload | undefined> {
    const sourceLocale = this.config.languages[0].locale;

    const story = await Story.query()
      .where('id', storyId)
      .preload('localisations', (localisationsQuery) => {
        localisationsQuery.whereIn('locale', [locale, sourceLocale]);
      })
      .first();

    if (!story) return undefined;

    const target = story.localisations.find(
      (localisation) => localisation.locale === locale,
    ) ?? { ...emptyTranslation };
    const source = story.localisations.find(
      (localisation) => localisation.locale === sourceLocale,
    ) ?? { ...emptyTranslation };

    if (locale !== sourceLocale && !target.coverImage) {
      target.coverImage = source.coverImage;
    }

    const targetFields = this.localisationFields(target);

    return {
      ...targetFields,
      chapterLimit: story.chapterLimit,
      storyType: story.storyType ?? '',
      chapterType: story.chapterType ?? '',
      sectionType: story.sectionType ?? null,
      visibility: story.visibility,
      resources: target.resources ?? [],
      isPublished: this.localisationIsPublished(target),
    };
  }

  public async prepSections(
    version: StoryVersion,
    sections?: PostedSection[],
  ): Promise<StorySection[]> {
    if (!sections) return [];
    const sourceLocale = this.config.languages[0].locale;
    if (version.locale === sourceLocale) return this.sourceSections(sections);

    const sourceLocalisation = await StoryLocalisation.query()
      .where('storyId', version.storyId)
      .where('locale', sourceLocale)
      .first();

    const source = sourceLocalisation?.sections ?? [];
    if (!source.length) return [];

    return source.map((section, index) => {
      const posted = sections[index];
      return {
        id: section.id,
        title: posted?.title ?? '',
        description: posted?.description ?? '',
      };
    });
  }

  sourceSections(sections: PostedSection[]): StorySection[] {
    return sections.map((section) => {
      return {
        id: section.id?.trim() ? section.id : randomUUID(),
        title: section.title,
        description: section.description ?? '',
      };
    });
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
      const local = story.localisations[0];
      const index = indices.find((i) => i.storyId === story.id);
      const source = sourceModels.find((m) => m.storyId === story.id);

      return {
        id: story.id,
        name: local?.title || (source?.title ?? ''),
        description: local?.description ?? source?.description ?? '',
        coverImage: local?.coverImage || (source?.coverImage ?? ''),
        chapterLimit: story.chapterLimit,
        isPublished: this.localisationIsPublished(local),
        createdAt: story.createdAt?.toISO() ?? '',
        updatedAt: story.updatedAt?.toISO() ?? '',
        liveCount: index?.publishedList.length ?? 0,
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
    const localisation = story.localisations[0];
    return {
      id: story.id,
      name: localisation?.title ?? '',
      coverImage: localisation?.coverImage ?? '',
      chapterLimit: story.chapterLimit,
      chapterType: story.chapterType ?? '',
      storyType: story.storyType ?? '',
      visibility: story.visibility,
      schemaVersion: 1,
      isPublished: this.localisationIsPublished(localisation),
      fields: this.fieldsFromTemplate(story.template),
      sections: localisation?.sections ?? [],
    };
  }

  protected localisationIsPublished(
    localisation?: Pick<StoryLocalisation, 'isPublished'> | Partial<StoryLocalisation> | null,
  ): boolean {
    return localisation?.isPublished === true;
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

  private formatBespokeTemplateForDisplay(template: BundleTemplate): BundleTemplate {
    return {
      ...template,
      name: template.name.endsWith(' (custom)')
        ? template.name
        : `${template.name} (custom)`,
    };
  }

  private templatesForEditDisplay(): BundleTemplate[] {
    return [
      ...this.config.bespokeTemplates.map((template) =>
        this.formatBespokeTemplateForDisplay(template),
      ),
      ...this.config.storyTemplates,
    ];
  }

  protected fieldsFromTemplate(id: string): FieldSpec[] {
    const allTemplates = [...this.config.bespokeTemplates, ...this.config.storyTemplates];
    const template = allTemplates.find((t) => t.id === id);
    if (!template) return [];

    return template.fields;
  }

  public async homeStories(locale: string): Promise<{ stories: HomeStory[] }> {
    const chapters = await Chapter.query().where({ locale }).orderBy('number', 'asc');

    const storyModels = await Story.query()
      .preload('localisations', (localisationsQuery) => {
        localisationsQuery.where('locale', locale).where('isPublished', true);
      })
      .whereHas('localisations', (localisationsQuery) => {
        localisationsQuery.where('locale', locale).where('isPublished', true);
      })
      .orderBy('order', 'asc');

    const resourceService = new ResourceService();

    const stories = await Promise.all(
      storyModels.map(async (story) => {
        const local = story.localisations[0];
        const resources = local
          ? await resourceService.hydrate(local.resources ?? [])
          : [];

        return {
          id: story.id,
          name: local?.title ?? '',
          coverImage: local?.coverImage ?? '',
          chapterLimit: story.chapterLimit,
          chapterType: story.chapterType ?? '',
          storyType: story.storyType ?? '',
          description: local?.description ?? '',
          chapters: chapters
            .filter((chapter) => chapter.storyId === story.id)
            .map((chapter) => ({ id: chapter.number, ...chapter.bundle })),
          resources,
        };
      }),
    );

    return { stories };
  }
}

interface HomeStory {
  id: number;
  name: string;
  coverImage: string;
  chapterLimit: number;
  chapterType: string;
  storyType: string;
  description: string;
  chapters: Array<{ id: number } & Record<string, unknown>>;
  resources: ResourceItem[];
}
