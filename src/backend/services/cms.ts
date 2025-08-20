import app from '@adonisjs/core/services/app';
import CmsService from './cms_service.js';

const cms = await app.container.make(CmsService);
export { cms as default };
