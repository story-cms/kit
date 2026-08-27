<template>
  <Story title="Standard Chapter Edit Shell" group="stories">
    <Variant title="Source" :setup-app="loadDetails">
      <StandardChapterEditShell v-bind="sourceProps">
        <template #details>
          <StandardChapterEditDetails
            :chapter-type="sourceProps.story.chapterType"
            :image-collection-id="sourceProps.config.imageCollectionId"
            :template="sourceProps.story.template"
          />
        </template>
        <template #blocks="{ blocks, updateBlocks }">
          <StandardChapterEditBlocks
            :blocks="blocks"
            :video-collection-id="sourceProps.config.videoCollectionId"
            :image-collection-id="sourceProps.config.imageCollectionId"
            :chapter-type="sourceProps.story.chapterType"
            :template="sourceProps.story.template"
            @update:blocks="updateBlocks"
          />
        </template>
      </StandardChapterEditShell>
    </Variant>

    <Variant title="Translation" :setup-app="loadDetails">
      <StandardChapterEditShell v-bind="translationProps" is-translation>
        <template #details>
          <StandardChapterEditDetails
            :chapter-type="translationProps.story.chapterType"
            :image-collection-id="translationProps.config.imageCollectionId"
            :template="translationProps.story.template"
            :is-translation="true"
          />
        </template>
        <template #blocks="{ blocks, updateBlocks }">
          <StandardChapterEditBlocks
            :blocks="blocks"
            :video-collection-id="translationProps.config.videoCollectionId"
            :image-collection-id="translationProps.config.imageCollectionId"
            :chapter-type="translationProps.story.chapterType"
            :template="translationProps.story.template"
            :is-translation="true"
            @update:blocks="updateBlocks"
          />
        </template>
      </StandardChapterEditShell>
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
import StandardChapterEditShell from './standard-chapter-edit-shell.vue';
import StandardChapterEditBlocks from './standard-chapter-edit-blocks.vue';
import StandardChapterEditDetails from './standard-chapter-edit-details.vue';

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
# Standard Chapter Edit Shell

Shared source and translation layout for course and devotion draft editors. The
page wrappers provide their Details and Blocks implementations through scoped slots.
</docs>
