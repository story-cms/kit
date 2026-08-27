<template>
  <Story title="Course Draft Translation Edit" group="stories">
    <Variant title="Details tab" :setup-app="loadDetails">
      <StandardChapterEdit
        :is-translation="true"
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="spanish"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleCourseDraftTranslationBundle"
        :source="sampleCourseDraftSourceBundle"
        :story="courseDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Blocks tab" :setup-app="loadBlocks">
      <StandardChapterEdit
        :is-translation="true"
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="spanish"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleCourseDraftTranslationBundle"
        :source="sampleCourseDraftSourceBundle"
        :story="courseDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Validation errors on tabs" :setup-app="loadValidationErrors">
      <StandardChapterEdit
        :is-translation="true"
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="spanish"
        :errors="courseDraftEditValidationErrors"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleCourseDraftTranslationBundle"
        :source="sampleCourseDraftSourceBundle"
        :story="courseDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StandardChapterEdit from './standard-chapter-edit.vue';
import {
  availableResources,
  courseDraftEditStory,
  courseDraftEditValidationErrors,
  mockResourceProviders,
  sampleCourseDraftSourceBundle,
  sampleCourseDraftTranslationBundle,
  sampleDevotionDraft,
  sharedProps,
  spanish,
  miniSidebar,
} from '../test/mocks';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const loadTranslationModel: StoryHandler = (): void => {
  const store = useModelStore();
  store.setModel({ ...sampleCourseDraftTranslationBundle });
  store.setSource({ ...sampleCourseDraftSourceBundle });
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
  useSharedStore().setErrors(courseDraftEditValidationErrors);
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Blocks');
  window.history.replaceState({}, '', url.toString());
};
</script>

<docs lang="md">
# Course Draft Translation Edit

Side-by-side course session draft translation editor with Details, Blocks, and Resources tabs. Mirrors `translation-index` layout with source column toggle and draft workflow actions.
</docs>
