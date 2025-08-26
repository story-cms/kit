import { errors, HttpContext } from '@adonisjs/core/http';
import type {
  StorySpec,
  CmsConfig,
  PageVersion,
  Version,
  SharedPageProps,
  LanguageSpecification,
  Bookmark,
} from '../../types';
import { defineConfig } from '../define_config.js';
import { PreferenceService } from './preference_service';

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

  public storyFrom(ctx: HttpContext): StorySpec | undefined {
    const storyId = Number.parseInt(ctx.params.storyId);
    const story = this.#config.stories.stories.find((s) => s.id === storyId);
    return story;
  }

  public localeFrom(ctx: HttpContext): string {
    if (!ctx.auth.use('web')?.user?.isAllowed(ctx.params.locale)) {
      throw errors.E_ROUTE_NOT_FOUND;
    }

    return ctx.params.locale || this.#config.languages.languages[0].locale;
  }

  public get sourceLocale(): string {
    return this.#config.languages.languages[0].locale;
  }

  public isTranslation(locale: string | undefined): boolean {
    return locale !== this.#config.languages.languages[0].locale;
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
    return ctx.request.qs()['locale'] || this.#config.languages.languages[0].locale;
  }

  public storyFromApi(ctx: HttpContext): StorySpec | undefined {
    if (this.#config.stories.stories.length === 0) return undefined;

    const defaultStory = this.#config.stories.stories[0];

    const storyId = ctx.request.qs()['storyId'];
    if (storyId !== undefined) {
      const story = this.#config.stories.stories.find((s) => s.id === Number(storyId));
      if (story !== undefined) return story;
    }

    let storylabel = ctx.request.qs()['story'];
    if (storylabel !== undefined) {
      storylabel = storylabel.toLowerCase();
      const story = this.#config.stories.stories.find(
        (s) => s.name.toLocaleLowerCase() === storylabel,
      );
      if (story !== undefined) return story;
    }

    return defaultStory;
  }

  public apiContextFrom(ctx: HttpContext): {
    story: StorySpec | undefined;
    version: Version;
  } {
    const story = this.storyFromApi(ctx);
    const locale =
      ctx.request.qs()['locale'] || this.#config.languages.languages[0].locale;
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
      apiVersion: this.#config.pages.schemaVersion,
      locale: ctx.params.locale || 'en',
    };
  }

  protected getLanguage(locale: string | null): LanguageSpecification {
    const found =
      this.#config.languages.languages.find(
        (language: LanguageSpecification) => language.locale === locale,
      ) || this.#config.languages.languages[0];
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
    const exclude: string[] = [];
    if (this.#config.stories.stories.length < 1) {
      exclude.push('story');
    }
    if (this.#config.streams.streams.length < 1) {
      exclude.push('stream');
    }
    if (this.#config.languages.languages.length < 1) {
      exclude.push('language');
    }
    // page, audience

    const bookmarks = await this.getBookmarks(ctx);

    return {
      meta: this.#config.meta,
      user: ctx.auth?.use('web')?.user,
      language: this.getLanguage(ctx.params.locale ?? 'en'),
      languages: this.#config.languages.languages,
      exclude,
      bookmarks,
    };
  }
}
