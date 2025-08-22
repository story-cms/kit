<template>
  <Story title="Story Edit" group="stories">
    <Variant title="Default" :setup-app="loadNormalData">
      <StoryEdit
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="{}"
        :stories="['John', 'Acts']"
        :story="storyData"
        :is-new="false"
        :providers={}
      />
    </Variant>

    <Variant title="New story" :setup-app="loadNormalData">
      <StoryEdit
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="{}"
        :stories="['John', 'Acts']"
        :story="newStoryData"
        :is-new="true"
        :providers={}
      />
    </Variant>

    
  </Story>
</template>

<script setup lang="ts">
import StoryEdit from './story-edit.vue';
import { sharedProps, miniSidebar } from '../test/mocks';
import { useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const storyData = {
  id: 1,
  name: 'The Gospel of John',
  storyType: 'gospel',
  chapterType: 'chapter',
  coverImage: 'https://res.cloudinary.com/onesheep/image/upload/v1669793982/cld-sample-2.jpg',
  chapterLimit: 21,
  tags: 'gospel,john,new-testament',
  description: '# The Gospel of John\n\nThis is the fourth gospel in the New Testament...',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:45:00Z',
};

const newStoryData = {
  id: 0,
  name: '',
  storyType: 'story',
  chapterType: 'chapter',
  coverImage: '',
  chapterLimit: 0,
  tags: '',
  description: '',
  createdAt: '2024-01-25T09:00:00Z',
  updatedAt: '2024-01-25T09:00:00Z',
};

const storyErrors = {
  'bundle.name': ['The title field is required'],
  'bundle.description': ['The description field is required'],
  'bundle.coverImage': ['Please select a valid image file'],
};

const loadRtlData: StoryHandler = ({ app, story, variant }): void => {
  const shared = useSharedStore();
  
  shared.setLanguage({
    locale: 'ar',
    language: 'العربية',
    languageDirection: 'rtl',
  });
  
  // Also call miniSidebar to close sidebar
  miniSidebar({ app, story, variant });
};

const loadNormalData: StoryHandler = ({ app, story, variant }): void => {
  const shared = useSharedStore();
  shared.setLanguage({
    locale: 'en',
    language: 'English',
    languageDirection: 'ltr',
  });
  
  // Also call miniSidebar to close sidebar
  miniSidebar({ app, story, variant });
};

</script>

<docs lang="md">
# Story Edit

A comprehensive page component for creating and editing stories in the CMS.

## Usage

```vue
<StoryEdit
  :meta="meta"
  :user="user"
  :languages="languages"
  :language="language"
  :errors="errors"
  :stories="stories"
  :story="story"
  :providers="providers"
/>
```

## Props

- `meta` - CMS metadata from sharedProps
- `user` - User data from sharedProps
- `languages` - Available languages from sharedProps
- `language` - Current language from sharedProps
- `errors` - Error state from sharedProps
- `stories` - Available stories array
- `story` - Story data object with fields like name, coverImage, chapterLimit, tags, description
- `providers` - Media providers for file uploads

## Features

- Form fields for story title, cover image, chapter limit, tags, and description
- Image upload with file validation
- Markdown editor for story description
- Tag management
- Meta box showing story metadata
- Save and delete functionality
- Responsive layout with sidebar
- Error handling and validation
- RTL language support

## Variants

- **Default** - Standard story editing interface
- **New story** - Interface for creating a new story
- **With errors** - Shows validation error states with ErrorControl
- **RTL** - Right-to-left language support testing
</docs>
