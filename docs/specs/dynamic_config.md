# Dynamic config

Each Journeys Studio instance can be configured to fit the unique needs of the subscriber.
There are two types of configuration settings - tracked and untracked.

Most settings are `untracked`. They are stored in the database and can be different for
each environment (develop, staging or production). Admin users can self-serve and
configure their own studio instance via these settings.

Some settings need to be `tracked` in configuration files, because they form part of the
subscription contract and can only change through a managed upgrade path. This would
include:

- elements provisioning flags (can be superceded by a subscription api in future)
- bespoke story chapter or stream drop definitions
- config with pending editing UI

Key files:

- `src/types.ts#CmsConfig`: the type contract for the configuration schema
- `src/backend/define_config.ts`: the config schema and starting defaults
- `config/cms.ts`: tracked settings

## Sensible starting schema

- toggle all features including users and languages
- hasVideo, hasAudio, hasScripture

```
export type CmsConfig = {
  meta: CmsMeta;

  languages: {
    languages: LanguageSpecification[];
    microcopySource: string;
  };

  streams: {
    hasStreams?: boolean;
    streams: StreamSpec[];
  };

  stories: {
    hasStories?: boolean;
    hasEditReview: boolean;
    stories: StorySpec[];
  };

  pages: {
    hasPages?: boolean;
    schemaVersion: number;
    tracking: string;
  };

  audience: {
    hasAudience?: boolean;
  };

  campaigns: {
    hasCampaigns?: boolean;
  };
};
```

## Config schema migration

The schema of the framework config will change as we iterate over features. The migration
works as follows:

- `defineConfig` from the kit dictates the target schema of the configuration
- we have a stubbed command `/commands/migrate_config.ts` that we can run in our CD pipe
  to migrate the schema in the environment's database

## Config cascade

To get to the correct config settings in the cms_service the following cascade is
enforced:

1. defineConfig defaults which can be superceded via override by
2. settings from the config table which can be superceded by
3. config/cms.ts tracked settings

## Config sync
