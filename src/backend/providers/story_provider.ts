import { RuntimeException } from '@poppinss/utils';
import type { ApplicationService } from '@adonisjs/core/types';

import VersionContext from '../middleware/version_context';

/**
 * Story provider helps to
 */
export default class StoryProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register middleware
   */
  register() {
    this.app.container.bind(VersionContext, async (resolver) => {
      const configService = await resolver.make('config');
      const storyConfig = configService.get<any>('story');

      if (!storyConfig) {
        throw new RuntimeException(
          'Invalid "config/story.ts" file. Make sure you are using the "defineConfig" method',
        );
      }

      return new VersionContext(storyConfig);
    });
  }
}
