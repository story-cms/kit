<template>
  <Story title="Story Create" group="stories">
    <Variant title="Default" :setup-app="loadNormalData">
      <StoryCreate
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="emptyModel"
        :templates="singleTemplate"
        :providers="{}"
      />
    </Variant>

    <Variant title="Multiple templates" :setup-app="loadNormalData">
      <StoryCreate
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="emptyModel"
        :templates="storyTemplates"
        :providers="{}"
      />
    </Variant>

    <Variant title="Prefilled" :setup-app="loadNormalData">
      <StoryCreate
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="prefilledModel"
        :templates="storyTemplates"
        :providers="{}"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StoryCreate from './story-create.vue';
import { sharedProps, miniSidebar } from '../test/mocks';
import { useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';
import type { BundleTemplate, StoryCreateProps } from '../../types';

const emptyModel: StoryCreateProps['model'] = {
  title: '',
  coverImage: '',
  description: '',
  chapterLimit: 10,
  tags: null,
  storyType: 'Story',
  chapterType: 'Chapter',
  sectionType: null,
  visibility: 'public',
  slug: null,
  template: 'devotion',
};

const prefilledModel: StoryCreateProps['model'] = {
  title: 'Introduction to Christianity',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  description: 'A brief overview of the core beliefs and practices of Christianity.',
  chapterLimit: 12,
  tags: 'course,introduction,basics',
  storyType: 'Course',
  chapterType: 'Session',
  sectionType: 'Part',
  visibility: 'public',
  slug: null,
  template: 'course',
};

const singleTemplate: BundleTemplate[] = [
  {
    id: 'devotion',
    name: 'Devotion',
    fields: [],
  },
];

const storyTemplates: BundleTemplate[] = [
  {
    id: 'devotion',
    name: 'Devotion',
    fields: [],
  },
  {
    id: 'course',
    name: 'Course',
    fields: [],
  },
  {
    id: 'plan',
    name: 'Plan',
    fields: [],
  },
];

const loadNormalData: StoryHandler = ({ app, story, variant }): void => {
  const shared = useSharedStore();
  shared.setLanguage({
    locale: 'en',
    language: 'English',
    languageDirection: 'ltr',
  });

  miniSidebar({ app, story, variant });
};
</script>

<docs lang="md">
# Story Create

Full-page form for creating a new story. Collects title, cover image, classification fields,
and optional content shape when multiple templates are available.

In production, this page is reached from the Story Gallery **+** button when
`multi-story` is included in `config.subscriptions`. See [Story Gallery](./story-gallery.story.vue).

## Usage

```vue
<StoryCreate
  :config="config"
  :user="user"
  :language="language"
  :errors="errors"
  :bookmarks="bookmarks"
  :model="model"
  :templates="templates"
  :providers="providers"
/>
```
</docs>
