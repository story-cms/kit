<template>
  <Story title="Chapter Draft Edit Shell" group="stories">
    <Variant title="Source" :setup-app="loadDetails">
      <chapter-draft-edit-shell v-bind="sourceProps">
        <template #details>
          <course-draft-edit-details :chapter-type="sourceProps.story.chapterType" />
        </template>
        <template #blocks="{ blocks, updateBlocks }">
          <course-draft-edit-blocks
            :blocks="blocks"
            :video-collection-id="sourceProps.config.videoCollectionId"
            :chapter-type="sourceProps.story.chapterType"
            :template="sourceProps.story.template"
            @update:blocks="updateBlocks"
          />
        </template>
      </chapter-draft-edit-shell>
    </Variant>

    <Variant title="Translation" :setup-app="loadDetails">
      <chapter-draft-edit-shell v-bind="translationProps" is-translation>
        <template #details>
          <course-draft-edit-details
            :chapter-type="translationProps.story.chapterType"
            :is-translation="true"
          />
        </template>
        <template #blocks="{ blocks, updateBlocks }">
          <course-draft-edit-blocks
            :blocks="blocks"
            :video-collection-id="translationProps.config.videoCollectionId"
            :chapter-type="translationProps.story.chapterType"
            :template="translationProps.story.template"
            :is-translation="true"
            @update:blocks="updateBlocks"
          />
        </template>
      </chapter-draft-edit-shell>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import type { StoryHandler } from '../../shared/helpers';
import {
  courseDraftEditProps,
  miniSidebar,
  sampleCourseDraftSourceBundle,
  sampleCourseDraftTranslationBundle,
  sharedProps,
  spanish,
} from '../../test/mocks';
import ChapterDraftEditShell from './chapter-draft-edit-shell.vue';
import CourseDraftEditBlocks from './course-draft-edit-blocks.vue';
import CourseDraftEditDetails from './course-draft-edit-details.vue';

const sourceProps = {
  ...sharedProps,
  ...courseDraftEditProps,
};

const translationProps = {
  ...sourceProps,
  language: spanish,
  bundle: sampleCourseDraftTranslationBundle,
  source: sampleCourseDraftSourceBundle,
};

const loadDetails: StoryHandler = (context): void => {
  miniSidebar(context);
  const url = new URL(window.location.href);
  url.searchParams.delete('tab');
  window.history.replaceState({}, '', url.toString());
};
</script>

<docs lang="md">
# Chapter Draft Edit Shell

Shared source and translation layout for course and devotion draft editors. The
page wrappers provide their Details and Blocks implementations through scoped slots.
</docs>
