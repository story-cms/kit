import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

export default class Admin {
  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.use('web').check();

    if (!ctx.auth.use('web').isAuthenticated) {
      ctx.response.unauthorized({ error: 'You have to be logged in' });
      return;
    }

    if (!ctx.auth.use('web').user?.isAdmin) {
      ctx.response.forbidden({ error: 'Only for site administrators' });
      return;
    }

    await next();
  }
}

/**
 * HttpContext augmentations
 */
declare module '@adonisjs/core/http' {
  export interface HttpContext {
    auth: any;
  }
}
