<template>
  <Story title="Devotion Draft Translation Edit" group="stories">
    <Variant title="Details tab" :setup-app="loadDetails">
      <DevotionDraftTranslationEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="spanish"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftTranslationBundle"
        :source="sampleDevotionDraftSourceBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Blocks tab" :setup-app="loadBlocks">
      <DevotionDraftTranslationEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="spanish"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftTranslationBundle"
        :source="sampleDevotionDraftSourceBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Validation errors on tabs" :setup-app="loadValidationErrors">
      <DevotionDraftTranslationEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="spanish"
        :errors="devotionDraftEditValidationErrors"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftTranslationBundle"
        :source="sampleDevotionDraftSourceBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import DevotionDraftTranslationEdit from './devotion-draft-translation-edit.vue';
import {
  availableResources,
  devotionDraftEditStory,
  devotionDraftEditValidationErrors,
  mockResourceProviders,
  sampleDevotionDraft,
  sampleDevotionDraftSourceBundle,
  sampleDevotionDraftTranslationBundle,
  sharedProps,
  spanish,
  miniSidebar,
} from '../test/mocks';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const loadTranslationModel: StoryHandler = (): void => {
  const store = useModelStore();
  store.setModel({ ...sampleDevotionDraftTranslationBundle });
  store.setSource({ ...sampleDevotionDraftSourceBundle });
};

const loadDetails: StoryHandler = (context): void => {
  miniSidebar(context);
  loadTranslationModel(context);
  const url = new URL(window.location.href);
  url.searchParams.delete('tab');
  window.history.replaceState({}, '', url.toString());
};

const loadBlocks: StoryHandler = (context): void => {
  miniSidebar(context);
  loadTranslationModel(context);
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Blocks');
  window.history.replaceState({}, '', url.toString());
};

const loadValidationErrors: StoryHandler = (context): void => {
  miniSidebar(context);
  loadTranslationModel(context);
  useSharedStore().setErrors(devotionDraftEditValidationErrors);
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Blocks');
  window.history.replaceState({}, '', url.toString());
};
</script>

<docs lang="md">
# Devotion Draft Translation Edit

Side-by-side devotion draft translation editor with Details, Blocks, and Resources tabs. Includes audio field in Details and scripture blocks in Blocks.
</docs>
