<template>
  <Story title="Story Edit" group="stories">
    <Variant title="Default" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="storyModel"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
      />
    </Variant>

    <Variant title="Empty resources" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="emptyResourcesModel"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StoryEdit from './story-edit.vue';
import {
  availableResources,
  listModel,
  sampleAttachedResources,
  sharedProps,
  miniSidebar,
} from '../test/mocks';
import { useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';
import type { StoryEditProps } from '../../types';

const storyModel: StoryEditProps['model'] = {
  id: 1,
  title: 'The Gospel of John',
  storyType: 'gospel',
  chapterType: 'chapter',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  chapterLimit: 21,
  isPublished: true,
  tags: 'gospel,john,new-testament',
  description:
    '# The Gospel of John\n\nThis is the fourth gospel in the New Testament...',
  sectionType: null,
  visibility: 'public',
  slug: 'gospel-of-john',
  template: 'devotion',
  sections: listModel.sections,
  resources: sampleAttachedResources,
};

const emptyResourcesModel: StoryEditProps['model'] = {
  ...storyModel,
  title: 'Untitled Story',
  resources: [],
};

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
# Story Edit

Full-page story editor with tabbed navigation for Details, Sections, and Resources.
Saving posts attached resource IDs to the story localisation.

## Usage

```vue
<StoryEdit
  :config="config"
  :user="user"
  :language="language"
  :errors="errors"
  :bookmarks="bookmarks"
  :model="model"
  :available-resources="availableResources"
  :has-no-content="hasNoContent"
  :providers="providers"
/>
```
</docs>
