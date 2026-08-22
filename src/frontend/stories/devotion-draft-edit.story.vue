<template>
  <Story title="Devotion Draft Edit" group="stories">
    <Variant title="Create" :setup-app="loadCreate">
      <StandardChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="emptyDevotionDraftBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :is-create="true"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Chapter 2 create" :setup-app="loadChapterTwoCreate">
      <StandardChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="devotionDraftEditChapterTwoCreateProps.draft"
        :bundle="devotionDraftEditChapterTwoCreateProps.bundle"
        :story="devotionDraftEditDevotionStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :is-create="true"
        :previous-chapter-blocks="devotionDraftEditChapterTwoCreateProps.previousChapterBlocks"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Edit" :setup-app="loadEdit">
      <StandardChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="'2025-10-24T06:10:38.483+00:00'"
        :providers="mockResourceProviders"
      />
      <ModelControl :model="sampleDevotionDraftBundle" :is-inspect-only="true" />
    </Variant>

    <Variant title="Blocks tab" :setup-app="loadBlocksTab">
      <StandardChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Devotion" :setup-app="loadDevotionBlocksTab">
      <StandardChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionChapterBundle"
        :story="devotionDraftEditDevotionStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Resources tab" :setup-app="loadResourcesTab">
      <StandardChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Validation errors on tabs" :setup-app="loadValidationErrors">
      <StandardChapterEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="devotionDraftEditValidationErrors"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Edit review: Submit" :setup-app="loadEdit">
      <StandardChapterEdit
        :config="sharedProps.config"
        :user="editorUser"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="true"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Edit review: Request change" :setup-app="loadEdit">
      <StandardChapterEdit
        :config="sharedProps.config"
        :user="adminUser"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraftSubmitted"
        :bundle="sampleDevotionDraftBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="true"
        :last-published="'2025-10-24T06:10:38.483+00:00'"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Mark Ready" :setup-app="loadEdit">
      <StandardChapterEdit
        :config="sharedProps.config"
        :user="adminUser"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="true"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StandardChapterEdit from './standard-chapter-edit.vue';
import ModelControl from '../test/model-control.vue';
import {
  adminUser,
  availableResources,
  devotionDraftEditStory,
  devotionDraftEditDevotionStory,
  devotionDraftEditChapterTwoCreateProps,
  devotionDraftEditValidationErrors,
  editorUser,
  emptyDevotionDraftBundle,
  mockResourceProviders,
  sampleDevotionDraftBundle,
  sampleDevotionChapterBundle,
  sampleDevotionDraft,
  sampleDevotionDraftSubmitted,
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

const loadChapterTwoCreate: StoryHandler = (context): void => {
  miniSidebar(context);
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Blocks');
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
  useSharedStore().setErrors(devotionDraftEditValidationErrors);
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Blocks');
  window.history.replaceState({}, '', url.toString());
};
</script>

<docs lang="md">
# Devotion Draft Edit

Tabbed devotion draft editor with Details, Blocks, and Resources. Includes draft lifecycle actions (delete, submit, publish, request change) and a two-second autosave. No sidebar meta/preview.

## Variants

- **Create** — empty chapter that autosaves as it is edited
- **Chapter 2 create** — empty chapter 2 on Blocks tab with Reuse Previous Structure
- **Edit** — populated chapter with Publish changes (no edit-review)
- **Blocks tab** — opens directly on the Blocks tab
- **Devotion** — Devotion chapter type with sample blocks, opens on the Blocks tab
- **Resources tab** — opens directly on the Resources tab
- **Validation errors on tabs** — Blocks tab with inline field errors and tab indicators
- **Edit review: Submit** — editor with edit-review sees Submit
- **Edit review: Request change** — admin reviewing a submitted draft
- **Mark Ready** — admin publish label when never published
</docs>
