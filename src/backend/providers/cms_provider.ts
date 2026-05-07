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
      const persisted = await Config.query()
        .where('key', 'cms')
        .orderBy('version', 'desc')
        .first();

      if (persisted) {
        untrackedConfig = defineConfig(persisted.data as CmsConfig);
      } else {
        untrackedConfig = defineConfig({});
        await Config.create({
          key: 'cms',
          version: 1,
          data: untrackedConfig,
        });
      }

      // tracked config
      const configService = await resolver.make('config');
      const trackedConfig = configService.get<any>('cms') as CmsConfig;

      const cmsConfig = {
        ...untrackedConfig,
        ...trackedConfig,
      };

      return new CmsService(cmsConfig);
    });
  }
}
