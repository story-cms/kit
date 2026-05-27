import { CmsService } from '../services/cms_service.js';
import type { ApplicationService } from '@adonisjs/core/types';
import Config from '../models/config.js';
import { CmsConfig } from '../../types.js';
import { defineConfig } from '../define_config.js';

export default class CmsProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(CmsService, async (resolver) => {
      // untracked config
      let untrackedConfig: CmsConfig;
      const persistedRow = await Config.query()
        .where('key', 'cms')
        .orderBy('version', 'desc')
        .first();

      const loadedFromDatabase = persistedRow !== null;

      if (persistedRow) {
        untrackedConfig = defineConfig(persistedRow.data as CmsConfig);
      } else {
        untrackedConfig = defineConfig({});
        await Config.create({
          key: 'cms',
          version: 1,
          data: untrackedConfig,
        });
      }

      // tracked config (filesystem) — overlays DB except `languages`, which must stay DB-backed after first seed
      const configService = await resolver.make('config');
      const trackedConfig =
        (configService.get<any>('cms') as Partial<CmsConfig> | undefined) ?? {};
      const trackedRest = { ...trackedConfig };
      delete trackedRest.languages;

      const cmsConfig = {
        ...untrackedConfig,
        ...trackedRest,
        languages: loadedFromDatabase
          ? untrackedConfig.languages
          : defineConfig({ ...untrackedConfig, ...trackedConfig }).languages,
      };

      return new CmsService(cmsConfig);
    });
  }
}
