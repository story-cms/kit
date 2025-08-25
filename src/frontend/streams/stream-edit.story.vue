<template>
  <Story title="Stream Edit" group="streams">
    <Variant title="Default" :setup-app="loadData">
      <StreamEdit v-bind="combinedProps" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StreamEdit from './stream-edit.vue';
import { sharedProps } from '../test/mocks';
import { useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';
import type { DropMeta, StreamSpec, Providers } from '../../types';

// Mock data for stream edit
const streamMeta: DropMeta = {
  id: 1,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T14:30:00Z',
  updatedBy: 'John Doe',
};

const streamSpec: StreamSpec = {
  id: 1,
  title: 'Daily Devotional',
  coverImage:
    'https://res.cloudinary.com/theword121/image/upload/v1687245360/episodes/viseg2hegowcrapio6pt.svg',
  streamType: 'devotional',
  dropType: 'devotional',
  schemaVersion: 1,
  fields: [
    {
      name: 'content',
      label: 'Content',
      widget: 'markdown',
    },
    {
      name: 'tags',
      label: 'Tags',
      widget: 'tag',
    },
    {
      name: 'scripture',
      label: 'Scripture Reference',
      widget: 'scripture',
    },
  ],
};

const streamModel = {
  title: 'Morning Devotion',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756122407/christ-chaos-header_yqrufy_lzmfjt.jpg',
  releaseAt: '2024-01-16T08:00:00Z',
  isPublished: false,
  content:
    "# Morning Devotion\n\nToday we reflect on **God's love** and His amazing grace.",
  tags: 'devotional,morning,grace',
  scripture: {
    reference: 'John 3:16',
    verse:
      'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
  },
};

const providers: Providers = {
  cloudinary: {
    cloudName: 'theword121',
    apiKey: 'mock-api-key',
    secret: 'mock-secret',
    defaultPreset: 'ml_default',
  },
  s3: {
    accessKeyId: 'mock-access-key-id',
    accessKey: 'mock-access-key',
    bucket: 'story-cms-uploads',
    region: 'us-east-1',
    endpoint: 'https://s3.amazonaws.com',
  },
  bunny: {
    accessKey: 'mock-access-key',
    libraryId: 'story-cms',
    host: 'https://story-cms.b-cdn.net',
  },
};

// Combined meta that satisfies both DropMeta and CmsMeta
const combinedMeta = {
  ...streamMeta,
  ...sharedProps.meta,
};

// Combined props that satisfy both StreamEditProps and SharedPageProps
const combinedProps = {
  // StreamEditProps
  meta: combinedMeta,
  spec: streamSpec,
  model: streamModel,
  providers,
  // SharedPageProps
  user: sharedProps.user,
  language: sharedProps.language,
  languages: sharedProps.languages,
  errors: sharedProps.errors,
  stories: sharedProps.stories,
};

const loadData: StoryHandler = (): void => {
  const shared = useSharedStore();
  shared.setSidebarOpen(false);

  // Set up shared store with default props
  shared.setFromProps({
    ...sharedProps,
    meta: combinedMeta,
  });

  shared.clearErrors();
};
</script>

<docs lang="md">
# Stream Edit

A comprehensive page component for editing stream content with autosave functionality.

## Features

- **Form Fields**: Title, cover image, release date, and dynamic fields from spec
- **Autosave**: Automatically saves changes with debounced API calls
- **Publish Toggle**: Boolean field to control publication status
- **Error Handling**: Displays validation errors and reverts published status on errors
- **Responsive Layout**: Adapts between two-column and single-column layouts
- **RTL Support**: Supports right-to-left languages
- **Meta Information**: Shows creation and update metadata

## Props

- `meta` - Drop metadata (id, timestamps, updated by)
- `spec` - Stream specification with field definitions
- `model` - Form data model
- `providers` - Widget providers for file uploads
- `user` - Current user information
- `languages` - Available languages
- `language` - Current language
- `errors` - Validation errors
- `stories` - Available stories array

## Usage

```vue
<StreamEdit
  :meta="dropMeta"
  :spec="streamSpec"
  :model="formData"
  :providers="uploadProviders"
  :user="currentUser"
  :languages="availableLanguages"
  :language="currentLanguage"
  :errors="validationErrors"
  :stories="storyList"
/>
```

## Behavior

- **Autosave**: Triggers 1 second after model changes
- **Error Recovery**: Automatically sets `isPublished` to false when errors occur
- **Title Updates**: Dynamically updates page title based on form data
- **Delete Action**: Provides draft deletion functionality
- **Responsive**: Adapts layout based on screen size and user preference
</docs>
