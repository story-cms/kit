<template>
  <Story title="Course Draft Edit Blocks" group="stories" :setup-app="setupProviders">
    <Variant title="Default">
      <CourseDraftEditBlocks
        v-model:blocks="defaultBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        :image-collection-id="sharedProps.config.imageCollectionId"
        template="course"
        chapter-type="Session"
      />
    </Variant>

    <Variant title="Empty">
      <CourseDraftEditBlocks
        v-model:blocks="emptyBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        :image-collection-id="sharedProps.config.imageCollectionId"
        template="course"
        chapter-type="Session"
      />
    </Variant>

    <Variant title="Course blocks">
      <CourseDraftEditBlocks
        v-model:blocks="courseBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        :image-collection-id="sharedProps.config.imageCollectionId"
        template="course"
        chapter-type="Session"
      />
    </Variant>

    <Variant title="Reuse previous structure">
      <CourseDraftEditBlocks
        v-model:blocks="emptyBlocks"
        :previous-chapter-blocks="previousChapterBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        :image-collection-id="sharedProps.config.imageCollectionId"
        template="course"
        chapter-type="Session"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { ChapterBlock } from '../../../types';
import {
  mockResourceProviders,
  samplePreviousCourseChapterBlocks,
  sharedProps,
} from '../../test/mocks';
import { useWidgetsStore } from '../../store';
import type { StoryHandler } from '../../shared/helpers';
import CourseDraftEditBlocks from './course-draft-edit-blocks.vue';
import { createEmptyContentBlock } from './blocks/block-utils';

const setupProviders: StoryHandler = (): void => {
  useWidgetsStore().setProviders(mockResourceProviders);
};

const defaultBlocks = ref<ChapterBlock[]>([createEmptyContentBlock()]);
const emptyBlocks = ref<ChapterBlock[]>([]);
const previousChapterBlocks = samplePreviousCourseChapterBlocks;

const courseBlocks = ref<ChapterBlock[]>([...samplePreviousCourseChapterBlocks]);
</script>

<docs lang="md">
# Course Draft Edit Blocks

Content block editor for the Blocks tab on course draft edit pages. Supports content and title blocks (no scripture block kind), course block roles, and reuse previous structure on chapter 2+.
</docs>
