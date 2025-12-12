import { CmsService } from '../services/cms_service.js';
import type { ApplicationService } from '@adonisjs/core/types';
import Config from '../models/config.js';
import { CmsConfig } from '../../types.js';

export default class CmsProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(CmsService, async (resolver) => {
      // check to see if we have a config in the database
      const persisted = await Config.query()
        .where('key', 'cms')
        .orderBy('version', 'desc')
        .first();

      let cmsConfig: CmsConfig;
      if (persisted) {
        cmsConfig = persisted.data as CmsConfig;
      } else {
        // save the default config to the database
        const configService = await resolver.make('config');
        cmsConfig = configService.get<any>('cms') as CmsConfig;
        await Config.create({
          key: 'cms',
          version: 1,
          data: cmsConfig as Record<string, any>,
        });
      }

      return new CmsService(cmsConfig!);
    });
  }
}
