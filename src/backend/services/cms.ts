import app from '@adonisjs/core/services/app';
import { CmsService } from './cms_service.js';

let cms: CmsService;
try {
  cms = await app.container.make(CmsService);
} catch (error) {
  console.error('Error loading cms service, using default config');
  cms = CmsService.default();
}

export { cms as default };
