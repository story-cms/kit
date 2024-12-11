import type Configure from '@adonisjs/core/commands/configure';
import { Codemods } from '@adonisjs/core/ace/codemods';
import { stubsRoot } from './stubs/main.js';
import string from '@poppinss/utils/string';
import { fsReadAll } from '@poppinss/utils';

async function addMigrations(command: Configure, codemods: Codemods) {
  const path = command.app.migrationsPath();
  const migrations = await fsReadAll(path);
  const baseMigrationExists = migrations.some((file) => file.endsWith('_base.ts'));

  if (baseMigrationExists) return;

  await codemods.makeUsingStub(stubsRoot, 'migration.stub', {
    migration: {
      folder: 'database/migrations',
      fileName: `${new Date().getTime()}_base.ts`,
    },
  });
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

async function fileExists(folder: string, fileName: string) {
  const files = await fsReadAll(folder);
  return files.some((file) => file === fileName);
}

/**
 * Configures the package
 */
export async function configure(command: Configure) {
  const codemods = await command.createCodemods();

  if ((await fileExists(command.app.configPath(), 'story.ts')) == false) {
    const options = await getOptions(command);
    codemods.overwriteExisting = false;
    await codemods.makeUsingStub(stubsRoot, 'config/story.stub', options);
  }

  codemods.overwriteExisting = true;
  await codemods.makeUsingStub(stubsRoot, 'config/inertia.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/users_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/auth_controller.stub', {});
  await codemods.makeUsingStub(
    stubsRoot,
    'controllers/forgot_password_controller.stub',
    {},
  );
  await codemods.makeUsingStub(stubsRoot, 'controllers/dashboard_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'mail/forget_password.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/users.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/auth.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/routes.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'inertia/app.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'resources/layout.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'models/user.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'models/chapter.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'models/draft.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'models/index.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'services/story_service.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'services/index_service.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'validators/user.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'validators/auth.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'commands/make_user.stub', {});
  await addMigrations(command, codemods);

  /**
   * Define environment variables
   */
  await codemods.defineEnvVariables({ MAIL_FROM_ADDRESS: 'ops@scoutredeem.co' });
  await codemods.defineEnvVariables({ CLOUDINARY_API_KEY: 'redacted' });
  await codemods.defineEnvVariables({ CLOUDINARY_SECRET: 'redacted' });
  await codemods.defineEnvVariables({ CLOUDINARY_CLOUD_NAME: 'pending' });
  await codemods.defineEnvVariables({ CLOUDINARY_PRESET: 'pending' });
  await codemods.defineEnvVariables({ BIBLE_API_KEY: 'redacted' });

  /**
   * Define environment variables validations
   */
  await codemods.defineEnvValidations({
    variables: {
      MAIL_FROM_ADDRESS: `Env.schema.string(),`,
    },
  });

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

  await codemods.registerMiddleware('named', [
    {
      name: 'admin',
      path: '@story-cms/kit/admin_middleware',
    },
  ]);
}

interface ConfigOptions {
  chapterType: string;
  storyType: string;
  storyName: string;
}
