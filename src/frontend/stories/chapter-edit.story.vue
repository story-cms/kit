<template>
  <Story title="Chapter Edit" group="stories">
    <Variant title="Create" :setup-app="loadCreate">
      <ChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleChapterDraft"
        :bundle="emptyChapterBundle"
        :story="chapterEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :is-create="true"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Edit" :setup-app="loadEdit">
      <ChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleChapterDraft"
        :bundle="sampleChapterBundle"
        :story="chapterEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="'2025-10-24T06:10:38.483+00:00'"
        :providers="mockResourceProviders"
      />
      <ModelControl :model="sampleChapterBundle" :is-inspect-only="true" />
    </Variant>

    <Variant title="Blocks tab" :setup-app="loadBlocksTab">
      <ChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleChapterDraft"
        :bundle="sampleChapterBundle"
        :story="chapterEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Resources tab" :setup-app="loadResourcesTab">
      <ChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleChapterDraft"
        :bundle="sampleChapterBundle"
        :story="chapterEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Validation errors on tabs" :setup-app="loadValidationErrors">
      <ChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="chapterEditValidationErrors"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleChapterDraft"
        :bundle="sampleChapterBundle"
        :story="chapterEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ChapterEdit from './chapter-edit.vue';
import ModelControl from '../test/model-control.vue';
import {
  availableResources,
  chapterEditStory,
  chapterEditValidationErrors,
  emptyChapterBundle,
  mockResourceProviders,
  sampleChapterBundle,
  sampleChapterDraft,
  sharedProps,
  miniSidebar,
} from '../test/mocks';
import { useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const loadCreate: StoryHandler = (context): void => {
  miniSidebar(context);
  const url = new URL(window.location.href);
  url.searchParams.delete('tab');
  window.history.replaceState({}, '', url.toString());
};

const loadEdit: StoryHandler = (context): void => {
  miniSidebar(context);
  const url = new URL(window.location.href);
  url.searchParams.delete('tab');
  window.history.replaceState({}, '', url.toString());
};

const loadBlocksTab: StoryHandler = (context): void => {
  miniSidebar(context);
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Blocks');
  window.history.replaceState({}, '', url.toString());
};

const loadResourcesTab: StoryHandler = (context): void => {
  miniSidebar(context);
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Resources');
  window.history.replaceState({}, '', url.toString());
};

const loadValidationErrors: StoryHandler = (context): void => {
  miniSidebar(context);
  useSharedStore().setErrors(chapterEditValidationErrors);
  const url = new URL(window.location.href);
  url.searchParams.delete('tab');
  window.history.replaceState({}, '', url.toString());
};
</script>

<docs lang="md">
# Chapter Edit

Tabbed chapter create/edit page with Details, Blocks, and Resources. Blocks use the shared block editor; chapter metadata uses fixed fields labelled with the story chapter type.

## Variants

- **Create** — empty chapter with Create Chapter action
- **Edit** — populated chapter with mixed blocks and attached resources
- **Blocks tab** — opens directly on the Blocks tab
- **Resources tab** — opens directly on the Resources tab
- **Validation errors on tabs** — error indicators on Details, Blocks, and Resources tabs
</docs>
