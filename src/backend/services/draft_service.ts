import Chapter from '../models/chapter.js';
import { FieldMap, FieldSpec, StorySpec, Version } from '../../types';
import { BundleService } from './bundle_service.js';
import { CmsService } from './cms_service.js';

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
  ) {
    this.story = story;
  }

  public async getDraftBundle(version: Version, number: number): Promise<string | null> {
    // is this the source language?
    if (version.locale === this.cms.config.languages.languages[0].locale) {
      const bundleService = new BundleService(this.story.fields);
      return bundleService.defaultBundle;
    }

    // it's a translation, so we need to get the source bundle
    const specifier = {
      apiVersion: version.apiVersion,
      locale: this.cms.config.languages.languages[0].locale,
      storyId: this.story.id,
      number: number,
    };
    const source = await Chapter.query().where(specifier).first();
    if (!source) return null;

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
}
