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

    <Variant title="Devotion" :setup-app="loadDevotionBlocksTab">
      <ChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleChapterDraft"
        :bundle="sampleDevotionChapterBundle"
        :story="chapterEditDevotionStory"
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

    <Variant title="Edit review: Submit" :setup-app="loadEdit">
      <ChapterEdit
        :config="sharedProps.config"
        :user="editorUser"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleChapterDraft"
        :bundle="sampleChapterBundle"
        :story="chapterEditStory"
        :available-resources="availableResources"
        :has-edit-review="true"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Edit review: Request change" :setup-app="loadEdit">
      <ChapterEdit
        :config="sharedProps.config"
        :user="adminUser"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleChapterDraftSubmitted"
        :bundle="sampleChapterBundle"
        :story="chapterEditStory"
        :available-resources="availableResources"
        :has-edit-review="true"
        :last-published="'2025-10-24T06:10:38.483+00:00'"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Mark Ready" :setup-app="loadEdit">
      <ChapterEdit
        :config="sharedProps.config"
        :user="adminUser"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleChapterDraft"
        :bundle="sampleChapterBundle"
        :story="chapterEditStory"
        :available-resources="availableResources"
        :has-edit-review="true"
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
  adminUser,
  availableResources,
  chapterEditStory,
  chapterEditDevotionStory,
  chapterEditValidationErrors,
  editorUser,
  emptyChapterBundle,
  mockResourceProviders,
  sampleChapterBundle,
  sampleDevotionChapterBundle,
  sampleChapterDraft,
  sampleChapterDraftSubmitted,
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

const loadDevotionBlocksTab: StoryHandler = (context): void => {
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

Tabbed chapter create/edit page with Details, Blocks, and Resources. Includes draft lifecycle actions (delete, submit, publish, request change), 2s autosave, and an explicit Save button. No sidebar meta/preview.

## Variants

- **Create** — empty chapter with Create Chapter action
- **Edit** — populated chapter with Publish changes (no edit-review)
- **Blocks tab** — opens directly on the Blocks tab
- **Devotion** — Devotion chapter type with sample blocks, opens on the Blocks tab
- **Resources tab** — opens directly on the Resources tab
- **Validation errors on tabs** — error indicators on Details, Blocks, and Resources tabs
- **Edit review: Submit** — editor with edit-review sees Submit
- **Edit review: Request change** — admin reviewing a submitted draft
- **Mark Ready** — admin publish label when never published
</docs>
