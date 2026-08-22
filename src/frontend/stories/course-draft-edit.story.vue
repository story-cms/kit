<template>
  <Story title="Course Draft Edit" group="stories">
    <Variant title="Create" :setup-app="loadCreate">
      <ChapterDraftEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="emptyCourseDraftBundle"
        :story="courseDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :is-create="true"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Chapter 2 create" :setup-app="loadChapterTwoCreate">
      <ChapterDraftEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="courseDraftEditChapterTwoCreateProps.draft"
        :bundle="courseDraftEditChapterTwoCreateProps.bundle"
        :story="courseDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :is-create="true"
        :previous-chapter-blocks="courseDraftEditChapterTwoCreateProps.previousChapterBlocks"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Edit" :setup-app="loadEdit">
      <ChapterDraftEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleCourseDraftBundle"
        :story="courseDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="'2025-10-24T06:10:38.483+00:00'"
        :providers="mockResourceProviders"
      />
      <ModelControl :model="sampleCourseDraftBundle" :is-inspect-only="true" />
    </Variant>

    <Variant title="Blocks tab" :setup-app="loadBlocksTab">
      <ChapterDraftEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleCourseChapterBundle"
        :story="courseDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Resources tab" :setup-app="loadResourcesTab">
      <ChapterDraftEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleCourseDraftBundle"
        :story="courseDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Validation errors on tabs" :setup-app="loadValidationErrors">
      <ChapterDraftEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="courseDraftEditValidationErrors"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleCourseDraftBundle"
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
import ChapterDraftEdit from './chapter-draft-edit.vue';
import ModelControl from '../test/model-control.vue';
import {
  availableResources,
  courseDraftEditStory,
  courseDraftEditChapterTwoCreateProps,
  courseDraftEditValidationErrors,
  emptyCourseDraftBundle,
  mockResourceProviders,
  sampleCourseDraftBundle,
  sampleCourseChapterBundle,
  sampleDevotionDraft,
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

const loadResourcesTab: StoryHandler = (context): void => {
  miniSidebar(context);
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Resources');
  window.history.replaceState({}, '', url.toString());
};

const loadValidationErrors: StoryHandler = (context): void => {
  miniSidebar(context);
  useSharedStore().setErrors(courseDraftEditValidationErrors);
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Blocks');
  window.history.replaceState({}, '', url.toString());
};
</script>

<docs lang="md">
# Course Draft Edit

Tabbed course session draft editor with Details, Blocks, and Resources. Same workflow as devotion draft edit but without audio in Details and without scripture block kind in Blocks.
</docs>
