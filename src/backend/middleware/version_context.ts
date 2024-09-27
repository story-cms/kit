import type { HttpContext } from '@adonisjs/core/http';

import type { NextFn } from '@adonisjs/core/types/http';
import { Story, StoryConfig, Version } from '../../interfaces';
import { Session } from '@adonisjs/session';

/**
 * HttpContext augmentations
 */
declare module '@adonisjs/core/http' {
  export interface HttpContext {
    session: Session;
    version: Version;
    story: Story;
  }
}

/**
 * VersionContext middleware enriches the request context
 * with the version and story information.
 *
 */
export default class VersionContext {
  constructor(private config: StoryConfig) {}

  async handle(ctx: HttpContext, next: NextFn) {
    if (this.shouldIgnore(ctx)) {
      await next();
      return;
    }

    // determine the version
    const story = this.getStoryFromSessionOrQuery(ctx);

    const version: Version = {
      apiVersion: this.config.schemaVersion,
      locale: ctx.session.get('locale') || ctx.request.qs()['locale'] || 'en',
      storyId: story.id,
    };

    // attach it to the context
    ctx.version = version;
    ctx.story = story;
    await next();
  }

  private getStoryFromSessionOrQuery(ctx: HttpContext): Story {
    const defaultStory = this.config.stories[0];

    // try from the session first
    const storyId = ctx.session.get('storyId');
    if (storyId !== undefined) {
      const story = this.config.stories.find((s) => s.id === storyId) || defaultStory;
      return story;
    }

    // for api calls, try the query parameters
    let storylabel = ctx.request.qs()['story'];
    if (storylabel === undefined) return defaultStory;

    storylabel = storylabel.toLowerCase();

    const story = this.config.stories.find(
      (s) => s.name.toLocaleLowerCase() === storylabel,
    );

    return story || defaultStory;
  }

  private shouldIgnore(ctx: HttpContext): boolean {
    if (ctx.request.matchesRoute('/switch')) return true;

    // public routes
    if (ctx.request.matchesRoute('/login')) return true;
    if (ctx.request.matchesRoute('/forgot-password')) return true;
    if (ctx.request.url().startsWith('/reset-password')) return true;

    return false;
  }
}
