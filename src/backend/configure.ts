import type Configure from '@adonisjs/core/commands/configure';
import { stubsRoot } from './stubs/main.js';
import string from '@poppinss/utils/string';

/**
 * Configures the package
 */
export async function configure(command: Configure) {
  const codemods = await command.createCodemods();

  /**
   * Prompt for the content types
   */

  const chapterType = await command.prompt.ask(
    'What is your basic structured content type?',
    {
      hint: 'chapter, day, devotion, episode, lesson, step, part etc.',
      validate(value) {
        return !!value;
      },
    },
  );

  const chapters = string.plural(chapterType);

  const storyTypePlural = await command.prompt.ask(
    `How would you organize some ${chapters}?`,
    {
      hint: 'stories, editions, books, seasons, courses, journeys, guides, modules etc.',
      validate(value) {
        return !!value;
      },
    },
  );

  const storyType = string.singular(storyTypePlural);

  const storyName = await command.prompt.ask(
    `What is the name of your first ${storyType}?`,
    {
      validate(value) {
        return !!value;
      },
    },
  );

  // /**
  //  * Publish config file
  //  */
  codemods.overwriteExisting = false;
  await codemods.makeUsingStub(stubsRoot, 'config/story.stub', {
    chapterType: string.titleCase(chapterType),
    storyType: string.titleCase(storyType),
    storyName: string.camelCase(storyName),
  });
  codemods.overwriteExisting = true;

  /**
   * Register provider
   */
  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@story-cms/kit/story_provider');
  });

  /**
   * Register middleware
   */
  await codemods.registerMiddleware('router', [
    {
      path: '@story-cms/kit/version_context_middleware',
    },
  ]);
}

// const addConfig = async (command: Configure) => {
// };
