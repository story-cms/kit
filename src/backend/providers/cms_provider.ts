import CmsService from '../services/cms_service';
import type { ApplicationService } from '@adonisjs/core/types';

export default class CmsProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(CmsService, async (resolver) => {
      const configService = await resolver.make('config');
      // NEXT: read from database
      const cmsConfig = configService.get<any>('cms');

      return new CmsService(cmsConfig);
    });
  }
}
