import { errors, HttpContext } from '@adonisjs/core/http';
import type { StorySpec, CmsConfig, PageVersion, Version } from '../../types';

export default class CmsService {
  protected cmsConfig: CmsConfig;

  public constructor(config: CmsConfig) {
    this.cmsConfig = config;
  }

  public get config(): CmsConfig {
    return this.cmsConfig;
  }

  public storyFrom(ctx: HttpContext): StorySpec | undefined {
    const storyId = Number.parseInt(ctx.params.storyId);
    const story = this.cmsConfig.stories.stories.find((s) => s.id === storyId);
    return story;
  }

  public localeFrom(ctx: HttpContext): string {
    if (!ctx.auth.use('web')?.user?.isAllowed(ctx.params.locale)) {
      throw errors.E_ROUTE_NOT_FOUND;
    }

    return ctx.params.locale || this.cmsConfig.languages.languages[0].locale;
  }

  public get sourceLocale(): string {
    return this.cmsConfig.languages.languages[0].locale;
  }

  public isTranslation(locale: string | undefined): boolean {
    return locale !== this.cmsConfig.languages.languages[0].locale;
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
    return ctx.request.qs()['locale'] || this.cmsConfig.languages.languages[0].locale;
  }

  public storyFromApi(ctx: HttpContext): StorySpec | undefined {
    if (this.cmsConfig.stories.stories.length === 0) return undefined;

    const defaultStory = this.cmsConfig.stories.stories[0];

    const storyId = ctx.request.qs()['storyId'];
    if (storyId !== undefined) {
      const story = this.cmsConfig.stories.stories.find((s) => s.id === Number(storyId));
      if (story !== undefined) return story;
    }

    let storylabel = ctx.request.qs()['story'];
    if (storylabel !== undefined) {
      storylabel = storylabel.toLowerCase();
      const story = this.cmsConfig.stories.stories.find(
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
      ctx.request.qs()['locale'] || this.cmsConfig.languages.languages[0].locale;
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
      apiVersion: this.cmsConfig.pages.schemaVersion,
      locale: ctx.params.locale || 'en',
    };
  }
}
