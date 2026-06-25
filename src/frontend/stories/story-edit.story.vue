<template>
  <Story title="Story Edit" group="stories">
    <Variant title="Save changes" :setup-app="loadNormalData">
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

    <Variant title="Save and publish" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="unpublishedModel"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
      />
    </Variant>

    <Variant title="Delete and save" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="deletableModel"
        :available-resources="availableResources"
        :has-no-content="true"
        :providers="{}"
      />
    </Variant>

    <Variant title="Delete, save and publish" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="deletableUnpublishedModel"
        :available-resources="availableResources"
        :has-no-content="true"
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

    <Variant title="Resources tab" :setup-app="loadResourcesTab">
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

const unpublishedModel: StoryEditProps['model'] = {
  ...storyModel,
  isPublished: false,
};

const deletableModel: StoryEditProps['model'] = {
  ...storyModel,
  title: 'Untitled Story',
  resources: [],
  isPublished: true,
};

const deletableUnpublishedModel: StoryEditProps['model'] = {
  ...deletableModel,
  isPublished: false,
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

const loadResourcesTab: StoryHandler = (context): void => {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Resources');
  window.history.replaceState({}, '', url.toString());
  loadNormalData(context);
};
</script>

<docs lang="md">
# Story Edit

Full-page story editor with tabbed navigation for Details, Sections, and Resources.
Saving posts attached resource IDs to the story localisation.

## Variants

- **Save changes** — published story with content; shows Save Changes only (`secondary`)
- **Save and publish** — unpublished story with content; shows Save Changes (`secondary`) and Publish (`green`)
- **Delete and save** — empty story, published; shows Delete (`red`) and Save Changes (`secondary`)
- **Delete, save and publish** — empty story, unpublished; shows Delete (`red`), Save Changes (`secondary`), and Publish (`green`)

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
