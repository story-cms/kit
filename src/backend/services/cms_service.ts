import { errors, HttpContext } from '@adonisjs/core/http';
import config from '@adonisjs/core/services/config';
import type {
  CmsConfig,
  Version,
  SharedPageProps,
  LanguageSpecification,
  Bookmark,
  AppUserInterface,
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

  public get sourceLocale(): string {
    return this.#config.languages[0].locale;
  }

  public isTranslation(locale: string | undefined): boolean {
    return locale !== this.sourceLocale;
  }

  /// ----------------------------------------------------
  ///  Controller selector helpers
  /// ----------------------------------------------------

  public localeFromPath(ctx: HttpContext): string {
    if (!ctx.auth.use('web')?.user?.isAllowed(ctx.params.locale)) {
      throw errors.E_ROUTE_NOT_FOUND;
    }

    return ctx.params.locale || this.sourceLocale;
  }

  public localeFromQuery(ctx: HttpContext): string {
    return ctx.request.qs()['locale'] || this.sourceLocale;
  }

  public versionFromPath(ctx: HttpContext): Version {
    if (!ctx.auth.use('web')?.user?.isAllowed(ctx.params.locale)) {
      throw errors.E_ROUTE_NOT_FOUND;
    }

    return {
      apiVersion: 1,
      locale: ctx.params.locale || this.sourceLocale,
    };
  }

  public versionFromQuery(ctx: HttpContext): Version {
    return {
      apiVersion: 1,
      locale: ctx.request.qs()['locale'] || this.sourceLocale,
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

    const user: AppUserInterface = ctx.auth?.use('web')?.user?.appUser ?? {
      id: 0,
      name: '',
      isAdmin: false,
      isManager: false,
      role: '',
    };

    return {
      user,
      config: {
        name: this.#config.name,
        logo: this.#config.logo,
        helpUrl: this.#config.helpUrl,
        supportEmail: this.#config.supportEmail,
        hasAppPreview: this.#config.hasAppPreview,
        videoCollectionId: this.#config.videoCollectionId,
        languages: this.#config.languages,
        subscriptions: this.#config.subscriptions,
      } as UiConfig,
      language: this.getLanguage(ctx.params.locale ?? 'en'),
      bookmarks,
    };
  }
}
