import { errors, HttpContext } from '@adonisjs/core/http';
import config from '@adonisjs/core/services/config';
import type {
  StorySpec,
  CmsConfig,
  PageVersion,
  Version,
  SharedPageProps,
  LanguageSpecification,
  Bookmark,
  UiConfig,
} from '../../types';
import { defineConfig } from '../define_config.js';
import { PreferenceService } from './preference_service.js';
import Config from '../models/config.js';

export class CmsService {
  #config: CmsConfig;

  public constructor(config: CmsConfig) {
    this.#config = config;
  }

  public static default(): CmsService {
    const config = defineConfig({});
    return new CmsService(config);
  }

  public get config(): CmsConfig {
    return this.#config;
  }

  public set config(config: CmsConfig) {
    this.#config = config;
  }

  public storyFrom(ctx: HttpContext): StorySpec | undefined {
    const storyId = Number.parseInt(ctx.params.storyId);
    const story = this.#config.stories.find((s) => s.id === storyId);
    return story;
  }

  public localeFrom(ctx: HttpContext): string {
    if (!ctx.auth.use('web')?.user?.isAllowed(ctx.params.locale)) {
      throw errors.E_ROUTE_NOT_FOUND;
    }

    return ctx.params.locale || this.sourceLocale;
  }

  public get sourceLocale(): string {
    return this.#config.languages[0].locale;
  }

  public isTranslation(locale: string | undefined): boolean {
    return locale !== this.sourceLocale;
  }

  public storyContextFrom(ctx: HttpContext): {
    story: StorySpec | undefined;
    version: Version;
  } {
    if (!ctx.auth.use('web')?.user?.isAllowed(ctx.params.locale)) {
      throw errors.E_ROUTE_NOT_FOUND;
    }

    const story = this.storyFrom(ctx);

    const version = <Version>{
      apiVersion: 1,
      locale: ctx.params.locale,
      storyId: story?.id,
    };
    return { story, version };
  }

  public localeFromApi(ctx: HttpContext): string {
    return ctx.request.qs()['locale'] || this.sourceLocale;
  }

  public storyFromApi(ctx: HttpContext): StorySpec | undefined {
    if (this.#config.stories.length === 0) return undefined;

    const defaultStory = this.#config.stories[0];

    const storyId = ctx.request.qs()['storyId'];
    if (storyId !== undefined) {
      const story = this.#config.stories.find((s) => s.id === Number(storyId));
      if (story !== undefined) return story;
    }

    let storylabel = ctx.request.qs()['story'];
    if (storylabel !== undefined) {
      storylabel = storylabel.toLowerCase();
      const story = this.#config.stories.find(
        (s) => s.name.toLocaleLowerCase() === storylabel,
      );
      if (story !== undefined) return story;
    }

    return defaultStory;
  }

  async patchConfig(fresh: Partial<CmsConfig>) {
    // get the active config
    const active = await Config.query()
      .where('key', 'cms')
      .orderBy('version', 'desc')
      .first();

    if (!active) return;

    // mutate the config
    const newConfig = defineConfig({ ...active.data, ...fresh });

    // persist the config
    active.data = newConfig;
    await active.save();

    const trackedConfig = config.get<CmsConfig>('cms') || {};

    // make sure we do not clobber the tracked config
    this.#config = { ...newConfig, ...trackedConfig };
  }

  public apiContextFrom(ctx: HttpContext): {
    story: StorySpec | undefined;
    version: Version;
  } {
    const story = this.storyFromApi(ctx);
    const locale = ctx.request.qs()['locale'] || this.sourceLocale;
    const version = <Version>{
      apiVersion: 1,
      locale: locale,
      storyId: story?.id,
    };

    return { story, version };
  }

  public pagesContextFrom(ctx: HttpContext): PageVersion {
    if (!ctx.auth.use('web')?.user?.isAllowed(ctx.params.locale)) {
      throw errors.E_ROUTE_NOT_FOUND;
    }

    return {
      apiVersion: this.#config.pagesSchemaVersion,
      locale: ctx.params.locale || 'en',
    };
  }

  protected getLanguage(locale: string | null): LanguageSpecification {
    const found =
      this.#config.languages.find(
        (language: LanguageSpecification) => language.locale === locale,
      ) || this.#config.languages[0];
    return found as LanguageSpecification;
  }

  protected async getBookmarks(ctx: HttpContext): Promise<Bookmark[]> {
    const userId = Number(ctx.auth?.use('web')?.user?.id);
    if (!userId) return [];

    try {
      const service = new PreferenceService();
      return await service.getUserBookmarks(userId);
    } catch {
      return [];
    }
  }

  public async sharedProps(ctx: HttpContext): Promise<SharedPageProps> {
    const bookmarks = await this.getBookmarks(ctx);

    return {
      config: {
        name: this.#config.name,
        logo: this.#config.logo,
        helpUrl: this.#config.helpUrl,
        hasAppPreview: this.#config.hasAppPreview,
        languages: this.#config.languages,
        subscriptions: this.#config.subscriptions,
      } as UiConfig,
      user: ctx.auth?.use('web')?.user,
      language: this.getLanguage(ctx.params.locale ?? 'en'),
      bookmarks,
    };
  }
}
