import type Configure from '@adonisjs/core/commands/configure';
import { Codemods } from '@adonisjs/core/ace/codemods';
import { stubsRoot } from './stubs/main.js';
import string from '@poppinss/utils/string';

async function addRoutes(command: Configure, codemods: Codemods) {
  const tsMorph = await codemods.getTsMorphProject();
  const routesFile = tsMorph?.getSourceFile(command.app.makePath('./start/routes.ts'));

  if (!routesFile) {
    return command.logger.warning('Unable to find the routes file');
  }

  const action = command.logger.action('update start/routes.ts file');
  try {
    routesFile?.addStatements((writer) => {
      writer.writeLine(`import { middleware } from '#start/kernel';`);
      writer.writeLine(`import users from '#start/routes/users';`);
      writer.writeLine(``);
      writer.writeLine(`router.group(() => {`);
      writer.writeLine(`users();`);
      writer.writeLine(`})`);
      writer.writeLine(`.use(middleware.auth());`);
    });

    await tsMorph?.save();
    action.succeeded();
  } catch (error) {
    codemods.emit('error', error);
    action.failed(error.message);
  }
}

async function getOptions(command: Configure): Promise<ConfigOptions> {
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

  return {
    chapterType: string.titleCase(chapterType),
    storyType: string.titleCase(storyType),
    storyName: string.camelCase(storyName),
  };
}

/**
 * Configures the package
 */
export async function configure(command: Configure) {
  const codemods = await command.createCodemods();

  const options = await getOptions(command);
  codemods.overwriteExisting = false;
  await codemods.makeUsingStub(stubsRoot, 'config/story.stub', options);

  codemods.overwriteExisting = true;
  await codemods.makeUsingStub(stubsRoot, 'config/inertia.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/users_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/users.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'inertia/app.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'models/user.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'validators/user.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'migration.stub', {
    migration: {
      folder: 'database/migrations',
      fileName: `${new Date().getTime()}_base.ts`,
    },
  });

  /**
   * Define environment variables
   */
  await codemods.defineEnvVariables({ CLOUDINARY_API_KEY: '' });
  await codemods.defineEnvVariables({ CLOUDINARY_SECRET: '' });
  await codemods.defineEnvVariables({ CLOUDINARY_CLOUD_NAME: '' });
  await codemods.defineEnvVariables({ CLOUDINARY_PRESET: '' });
  await codemods.defineEnvVariables({ BIBLE_API_KEY: '' });

  /**
   * Define environment variables validations
   */
  await codemods.defineEnvValidations({
    variables: {
      CLOUDINARY_API_KEY: `Env.schema.string(),`,
      CLOUDINARY_SECRET: `Env.schema.string(),`,
      CLOUDINARY_CLOUD_NAME: `Env.schema.string(),`,
      CLOUDINARY_PRESET: `Env.schema.string(),`,
    },
    leadingComment: 'Variables for configuring the Cloudinary service',
  });

  await codemods.defineEnvValidations({
    variables: {
      BIBLE_API_KEY: `Env.schema.string(),`,
    },
    leadingComment: 'Configuration for the Bible API service',
  });

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

  await addRoutes(command, codemods);
}

// const addConfig = async (command: Configure) => {
// };

interface ConfigOptions {
  chapterType: string;
  storyType: string;
  storyName: string;
}
