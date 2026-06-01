import { CmsService } from '../services/cms_service.js';
import type { ApplicationService } from '@adonisjs/core/types';
import Config from '../models/config.js';
import { CmsConfig } from '../../types.js';
import { defineConfig } from '../define_config.js';

export default class CmsProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(CmsService, async () => {
      let config: CmsConfig;
      const persistedRow = await Config.query()
        .where('key', 'cms')
        .orderBy('version', 'desc')
        .first();

      if (persistedRow) {
        config = defineConfig(persistedRow.data as CmsConfig);
      } else {
        config = defineConfig({});
        await Config.create({
          key: 'cms',
          version: 1,
          data: config,
        });
      }

      // DB row holds runtime config (notably languages); merge in deploy-time config from config/cms.ts
      return new CmsService(CmsService.mergeTrackedConfig(config));
    });
  }
}
