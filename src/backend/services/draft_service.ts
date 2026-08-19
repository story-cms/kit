import Chapter from '../models/chapter.js';
import Draft from '../models/draft.js';
import type {
  CourseDraftBundle,
  CourseDraftEditProps,
  DevotionDraftBundle,
  DevotionDraftEditProps,
  DraftEditProps,
  FieldMap,
  FieldSpec,
  Providers,
  ResourceItem,
  StoryChapterSpecifier,
  StorySpec,
  StoryVersion,
  JSON,
} from '../../types.js';
import { BundleService } from './bundle_service.js';
import { CmsService } from './cms_service.js';
import {
  createDevotionDraftBundle,
  normalizedDevotionDraftBundle,
} from '../../shared/devotion_draft.js';
import {
  createCourseDraftBundle,
  normalizedCourseDraftBundle,
} from '../../shared/course_draft.js';
import { isCourseTemplate, isDevotionTemplate } from '../../shared/story_helpers.js';
import {
  previousCourseChapterBlocks,
  previousDevotionChapterBlocks,
} from '../../shared/previous_chapter_blocks.js';

type BlockTemplate = 'devotion' | 'course';

export interface DraftResourceService {
  listForLocale(locale: string): Promise<ResourceItem[]>;
  hydrate(ids: string[]): Promise<ResourceItem[]>;
}

export interface DraftServiceDependencies {
  resourceService?: DraftResourceService;
}

export class DraftService {
  public story: StorySpec;

  // when creating a draft for a target language, it is handy for certain fields
  // to be prefilled to match the source language. For example, a translated
  // chapter seldom needs a different cover image or scripture reference
  // so we can prefill it for the translator to give them a running start
  #prefilledFields: string[] | null = null;

  constructor(
    story: StorySpec,
    protected cms: CmsService,
    private readonly dependencies: DraftServiceDependencies = {},
  ) {
    this.story = story;
  }

  public async create(version: StoryVersion, number: number): Promise<Draft | null> {
    const bundle = await this.getDraftBundle(version, number);
    if (bundle === null) return null;

    return Draft.create({
      ...version,
      number,
      bundle,
    });
  }

  public async editProps(options: {
    version: StoryVersion;
    number: number;
    providers: Providers;
    newDraftId?: number | string | null;
  }): Promise<DraftEditProps | DevotionDraftEditProps | CourseDraftEditProps | null> {
    const specifier: StoryChapterSpecifier = {
      apiVersion: options.version.apiVersion,
      locale: options.version.locale,
      storyId: options.version.storyId,
      number: options.number,
    };

    const resolved = await this.findOrCreateDraft(specifier);
    if (resolved === null) return null;

    const { draft, lastPublished } = resolved;

    const isTranslation = options.version.locale !== this.cms.sourceLocale;
    const base = this.baseDraftEditProps(draft, lastPublished, options.providers);

    if (isDevotionTemplate(this.story.template)) {
      return this.blockTemplateEditProps({
        template: 'devotion',
        isTranslation,
        draft,
        base,
        specifier,
        newDraftId: options.newDraftId,
      });
    }

    if (isCourseTemplate(this.story.template)) {
      return this.blockTemplateEditProps({
        template: 'course',
        isTranslation,
        draft,
        base,
        specifier,
        newDraftId: options.newDraftId,
      });
    }

    if (!isTranslation) {
      return base;
    }

    const sourceChapter = await this.loadSourceChapter(specifier);
    return {
      ...base,
      source: sourceChapter?.bundle,
    };
  }

  public async getDraftBundle(
    version: StoryVersion,
    number: number,
  ): Promise<JSON<any> | null> {
    // is this the source language?
    if (version.locale === this.cms.sourceLocale) {
      if (isDevotionTemplate(this.story.template)) {
        return JSON.stringify(createDevotionDraftBundle(number));
      }

      if (isCourseTemplate(this.story.template)) {
        return JSON.stringify(createCourseDraftBundle(number));
      }

      const bundleService = new BundleService(this.story.fields);
      return bundleService.defaultBundle;
    }

    // it's a translation, so we need to get the source bundle
    const specifier = {
      apiVersion: version.apiVersion,
      locale: this.cms.sourceLocale,
      storyId: this.story.id,
      number: number,
    };
    const source = await Chapter.query().where(specifier).first();
    if (!source) return null;

    if (isDevotionTemplate(this.story.template)) {
      return JSON.stringify(normalizedDevotionDraftBundle(source.bundle, number));
    }

    if (isCourseTemplate(this.story.template)) {
      return JSON.stringify(normalizedCourseDraftBundle(source.bundle, number));
    }

    const fresh = this.getFreshBundleFrom(source.bundle as any);
    return JSON.stringify(fresh);
  }

  public getFreshBundleFrom(sourceBundle: Record<string, any>): Record<string, any> {
    const draftBundle: Record<string, any> = {};

    Object.keys(sourceBundle).forEach((key) => {
      const value = sourceBundle[key];
      if (value === null) {
        draftBundle[key] = null;
        return;
      }

      if (Array.isArray(value)) {
        // is it a scripture reference?
        const isString = value.every((item) => typeof item === 'string');
        if (isString) {
          draftBundle[key] = value;
          return;
        }

        draftBundle[key] = value.map((item) => {
          if (item === null) return null;
          if (typeof item === 'object' || Array.isArray(item)) {
            return this.getFreshBundleFrom(item);
          }
          return this.leafValue(key, item);
        });
        return;
      }

      if (typeof value === 'object') {
        draftBundle[key] = this.getFreshBundleFrom(value);
        return;
      }

      draftBundle[key] = this.leafValue(key, value);
    });

    return draftBundle;
  }

  protected leafValue(key: string, value: any): any {
    // in prefilled list
    if (this.prefilledFields.some((item) => item === key)) {
      return value;
    }

    if (typeof value === 'string') {
      return '';
    }

    // numbers
    if (!Number.isNaN(Number(value))) {
      return value;
    }

    return '';
  }

  public setPrefilledFields(fields: string[]) {
    this.#prefilledFields = fields;
  }

  public get prefilledFields(): string[] {
    if (this.#prefilledFields) return this.#prefilledFields;
    this.#prefilledFields = [];
    this.story.fields.forEach((field) => {
      this.appendPrefilled(field as FieldSpec);
    });

    return this.#prefilledFields;
  }

  protected appendPrefilled(field: FieldSpec) {
    if (!this.#prefilledFields) {
      this.#prefilledFields = [];
    }

    switch (field['widget']) {
      case 'tag':
      case 'scriptureReference':
      case 'dateRange':
      case 'select':
      case 'number':
      case 'boolean':
      case 'image':
      case 'animation':
        // check if subPath is already in the list
        if (this.#prefilledFields.some((item) => item === field['name'])) break;
        this.#prefilledFields.push(field['name']);
        break;
      case 'panel': {
        const frame = field['fields'] as FieldSpec[];
        frame.forEach((item) => {
          this.appendPrefilled(item);
        });
        break;
      }
      case 'object': {
        const map = field['fields'] as FieldMap;
        Object.keys(map).forEach((key) => {
          this.appendPrefilled(map[key]);
        });
        break;
      }
      case 'list': {
        const items = field['fields'] as FieldSpec[];
        items.forEach((item) => {
          this.appendPrefilled(item);
        });
        break;
      }
      default:
        break;
    }
  }

  private async findOrCreateDraft(
    specifier: StoryChapterSpecifier,
  ): Promise<{ draft: Draft; lastPublished: string } | null> {
    let draft = await Draft.query().where(specifier).first();
    let lastPublished = '';

    const chapter = await Chapter.query().where(specifier).first();

    if (chapter) {
      lastPublished = chapter.updatedAt ? chapter.updatedAt.toString() : '';
    }

    if (!draft) {
      if (!chapter) {
        return null;
      }

      lastPublished = chapter.updatedAt.toString();
      draft = await Draft.create({
        ...specifier,
        bundle: chapter.bundle,
      });
    }

    return { draft, lastPublished };
  }

  private async loadSourceChapter(specifier: StoryChapterSpecifier) {
    return Chapter.query()
      .where({
        ...specifier,
        locale: this.cms.sourceLocale,
      })
      .first();
  }

  private baseDraftEditProps(
    draft: Draft,
    lastPublished: string,
    providers: Providers,
  ): DraftEditProps {
    return {
      draft: draft.meta,
      bundle: draft.bundle,
      lastPublished,
      providers,
      story: this.story,
      hasEditReview: this.cms.config.storiesHasEditReview,
    };
  }

  private async blockTemplateEditProps(options: {
    template: BlockTemplate;
    isTranslation: boolean;
    draft: Draft;
    base: DraftEditProps;
    specifier: StoryChapterSpecifier;
    newDraftId?: number | string | null;
  }): Promise<DevotionDraftEditProps | CourseDraftEditProps> {
    const { template, isTranslation, draft, base, specifier, newDraftId } = options;
    const normalized = this.normalizeBlockDraftBundle(
      template,
      draft.bundle,
      draft.number,
    );
    const { availableResources, resources } = await this.hydrateBlockDraftResources(
      specifier.locale,
      normalized.resources,
    );

    const sourceChapter = isTranslation ? await this.loadSourceChapter(specifier) : null;
    const sourceBundle = isTranslation
      ? this.normalizeBlockDraftBundle(template, sourceChapter?.bundle, draft.number)
      : undefined;

    const previousChapterBlocks =
      !isTranslation && draft.number > 1
        ? await this.previousChapterBlocks(template, {
            ...specifier,
            number: draft.number,
          })
        : [];

    const props = {
      ...base,
      bundle: {
        ...normalized,
        resources,
      },
      availableResources,
      ...(isTranslation
        ? { source: sourceBundle, previousChapterBlocks: [] }
        : {
            isCreate: Number(newDraftId) === draft.id,
            previousChapterBlocks,
          }),
    };

    if (template === 'devotion') {
      return props as DevotionDraftEditProps;
    }

    return props as CourseDraftEditProps;
  }

  private normalizeBlockDraftBundle(
    template: BlockTemplate,
    bundle: unknown,
    draftNumber: number,
  ): DevotionDraftBundle | CourseDraftBundle {
    if (template === 'devotion') {
      return normalizedDevotionDraftBundle(bundle, draftNumber);
    }

    return normalizedCourseDraftBundle(bundle, draftNumber);
  }

  private async hydrateBlockDraftResources(locale: string, resourceIds: string[]) {
    const resourceService = await this.getResourceService();
    const [availableResources, resources] = await Promise.all([
      resourceService.listForLocale(locale),
      resourceService.hydrate(resourceIds),
    ]);

    return { availableResources, resources };
  }

  private async previousChapterBlocks(
    template: BlockTemplate,
    specifier: StoryChapterSpecifier,
  ) {
    const loadBundle = async (spec: StoryChapterSpecifier) => {
      const previousDraft = await Draft.query().where(spec).first();
      if (previousDraft) {
        return previousDraft.bundle;
      }

      const previousChapter = await Chapter.query().where(spec).first();
      return previousChapter?.bundle ?? null;
    };

    if (template === 'devotion') {
      return previousDevotionChapterBlocks(specifier, loadBundle);
    }

    return previousCourseChapterBlocks(specifier, loadBundle);
  }

  private async getResourceService(): Promise<DraftResourceService> {
    if (this.dependencies.resourceService) return this.dependencies.resourceService;

    const { ResourceService } = await import('./resource_service.js');
    return new ResourceService();
  }
}
