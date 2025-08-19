import type Configure from '@adonisjs/core/commands/configure';
import { Codemods } from '@adonisjs/core/ace/codemods';
import { stubsRoot } from './stubs/main.js';

import { fsReadAll } from '@poppinss/utils';

async function addMigrations(command: Configure, codemods: Codemods) {
  const allMigrations = ['base', 'audit', 'drops', 'preferences'];

  const path = command.app.migrationsPath();
  const migrations = await fsReadAll(path);

  let timestamp = new Date().getTime();

  for (const stub of allMigrations) {
    const migrationExists = migrations.some((file) => file.endsWith(`${stub}.ts`));
    if (!migrationExists) {
      timestamp += 100;
      await codemods.makeUsingStub(stubsRoot, `migrations/${stub}.stub`, {
        migration: {
          folder: 'database/migrations',
          fileName: `${timestamp}_${stub}.ts`,
        },
      });
    }
  }
}

// async function fileExists(folder: string, fileName: string) {
//   const files = await fsReadAll(folder);
//   return files.some((file) => file === fileName);
// }

/**
 * Configures the package
 */
export async function configure(command: Configure) {
  const codemods = await command.createCodemods();

  /**
   * sensitive config files first
   */
  codemods.overwriteExisting = false;
  await codemods.makeUsingStub(stubsRoot, 'config/analytics.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'config/cms.stub', {});

  codemods.overwriteExisting = true;
  await codemods.makeUsingStub(stubsRoot, 'config/cache.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'config/inertia.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'config/providers.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'config/auth.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'services/cms.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/users_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/auth_controller.stub', {});
  await codemods.makeUsingStub(
    stubsRoot,
    'controllers/forgot_password_controller.stub',
    {},
  );
  await codemods.makeUsingStub(
    stubsRoot,
    'controllers/create_account_controller.stub',
    {},
  );
  await codemods.makeUsingStub(stubsRoot, 'controllers/dashboard_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/chapters_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/drafts_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/pages_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/admin_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/ui_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/analytics_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/preview_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/indices_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/audiences_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'mail/forget_password.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'mail/create_account.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/users.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/auth.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/routes.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/dashboard.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/pages.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/stories.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/api.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/ui.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/audience.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'inertia/app.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'inertia/css.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'resources/layout.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'resources/views/preview.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'resources/views/scripture.stub', {});

  await codemods.makeUsingStub(stubsRoot, 'commands/make_user.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'commands/fix_database.stub', {});
  // NOTE: remove when this is resolved: https://github.com/adonisjs/inertia-starter-kit/issues/12
  await codemods.makeUsingStub(stubsRoot, 'exceptions/handler.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/bootstrap.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/mock.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/rest.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/functional/draft.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/page_service.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/user_service.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/progress_service.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/model.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'ops/Dockerfile.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'ops/compose.stub', { appName: 'todo' });
  await codemods.makeUsingStub(stubsRoot, 'tailwind.stub', {});
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
  await codemods.defineEnvVariables({ OPENAI_API_KEY: 'redacted' });
  await codemods.defineEnvVariables({ GOOGLE_APPLICATION_CREDENTIALS_JSON: 'redacted' });
  await codemods.defineEnvVariables({ FIREBASE_SERVICE_ACCOUNT_KEY_JSON: 'redacted' });

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

  await codemods.defineEnvValidations({
    variables: {
      OPENAI_API_KEY: `Env.schema.string(),`,
    },
    leadingComment: 'Configuration for the OpenAI API service',
  });

  await codemods.defineEnvValidations({
    variables: {
      GOOGLE_APPLICATION_CREDENTIALS_JSON: `Env.schema.string(),`,
    },
    leadingComment: 'Configuration for the Google Analytics service',
  });

  await codemods.defineEnvValidations({
    variables: {
      FIREBASE_SERVICE_ACCOUNT_KEY_JSON: `Env.schema.string(),`,
    },
    leadingComment: 'Configuration for the Firebase service account key',
  });

  /**
   * Register providers
   */

  await codemods.updateRcFile((rcFile: any) => {
    rcFile.addProvider('@story-cms/kit/cms_provider');
  });

  /**
   * Register middleware
   */

  await codemods.registerMiddleware('named', [
    {
      name: 'admin',
      path: '@story-cms/kit/admin_middleware',
    },
    {
      name: 'noIndex',
      path: '@story-cms/kit/add_meta_noindex_middleware',
    },
  ]);
}
