import { CmsService } from '../services/cms_service.js';
import type { ApplicationService } from '@adonisjs/core/types';

export default class CmsProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(CmsService, async (resolver) => {
      // currently reading from config file
      // NEXT: read from database
      const configService = await resolver.make('config');
      const cmsConfig = configService.get<any>('cms');

      return new CmsService(cmsConfig);
    });
  }
}
