import type Configure from '@adonisjs/core/commands/configure';
import { Codemods } from '@adonisjs/core/ace/codemods';
import { stubsRoot } from './stubs/main.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fsReadAll } from '@poppinss/utils';

async function getExistingEnvKeys(appRoot: string): Promise<Set<string>> {
  try {
    const envPath = join(appRoot, '.env');
    const content = await readFile(envPath, 'utf-8');
    const keys = new Set<string>();
    for (const line of content.split('\n')) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);
      if (match) keys.add(match[1]);
    }
    return keys;
  } catch {
    return new Set();
  }
}

async function addMissingEnvVariables(
  codemods: Codemods,
  appRoot: string,
  variables: Record<string, string>,
): Promise<void> {
  const existing = await getExistingEnvKeys(appRoot);
  const toAdd = Object.fromEntries(
    Object.entries(variables).filter(([key]) => !existing.has(key)),
  );
  if (Object.keys(toAdd).length === 0) return;
  await codemods.defineEnvVariables(toAdd);
}

async function addMigrations(command: Configure, codemods: Codemods) {
  const allMigrations = ['base', 'audit', 'drops', 'preferences', 'campaigns'];

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
  await codemods.makeUsingStub(stubsRoot, 'config/bodyparser.stub', {});
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
  await codemods.makeUsingStub(stubsRoot, 'controllers/campaigns_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/chapters_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/drafts_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/pages_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/admin_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/ui_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/analytics_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/preview_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/indices_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/audiences_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/preferences_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/streams_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/stories_controller.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'controllers/users_controller.stub', {});

  await codemods.makeUsingStub(stubsRoot, 'routes/users.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/auth.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/routes.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/campaigns.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/dashboard.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/pages.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/stories.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/api.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/ui.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/audience.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/preferences.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'routes/streams.stub', {});

  await codemods.makeUsingStub(stubsRoot, 'mail/forget_password.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'mail/create_account.stub', {});

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
  await codemods.makeUsingStub(stubsRoot, 'tests/ui.rest.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/functional/draft.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/ui_service.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/campaign_service.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/page_service.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/stream_service.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/user_service.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/progress_service.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/model.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/helpers/cms_mock.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tests/unit/cms_mock_example.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'ops/Dockerfile.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'ops/compose.stub', { appName: 'todo' });
  await codemods.makeUsingStub(stubsRoot, 'ops/dockerignore.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'ops/gcloudignore.stub', {});
  await codemods.makeUsingStub(stubsRoot, 'tailwind.stub', {});
  await addMigrations(command, codemods);

  /**
   * Define environment variables (skip if already defined in .env)
   */
  const appRoot = fileURLToPath(command.app.appRoot);
  await addMissingEnvVariables(codemods, appRoot, {
    MAIL_FROM_ADDRESS: 'ops@scoutredeem.co',
    CLOUDINARY_API_KEY: 'redacted',
    CLOUDINARY_SECRET: 'redacted',
    CLOUDINARY_CLOUD_NAME: 'pending',
    CLOUDINARY_PRESET: 'pending',
    BIBLE_API_KEY: 'redacted',
    OPENAI_API_KEY: 'redacted',
    GOOGLE_APPLICATION_CREDENTIALS_JSON: 'redacted',
    FIREBASE_SERVICE_ACCOUNT_KEY_JSON: 'redacted',
  });

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
