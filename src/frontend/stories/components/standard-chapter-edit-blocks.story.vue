<template>
  <Story title="Standard Chapter Edit Blocks" group="stories" :setup-app="setupProviders">
    <Variant title="Default">
      <StandardChapterEditBlocks
        v-model:blocks="defaultBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        :image-collection-id="sharedProps.config.imageCollectionId"
        template="devotion"
        chapter-type="Day"
      />
    </Variant>

    <Variant title="Empty">
      <StandardChapterEditBlocks
        v-model:blocks="emptyBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        :image-collection-id="sharedProps.config.imageCollectionId"
        template="devotion"
        chapter-type="Day"
      />
    </Variant>

    <Variant title="Course">
      <StandardChapterEditBlocks
        v-model:blocks="courseBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        :image-collection-id="sharedProps.config.imageCollectionId"
        template="course"
        chapter-type="Session"
      />
    </Variant>

    <Variant title="Devotion">
      <StandardChapterEditBlocks
        v-model:blocks="devotionBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        :image-collection-id="sharedProps.config.imageCollectionId"
        template="devotion"
        chapter-type="Devotion"
      />
    </Variant>

    <Variant title="Mixed block kinds">
      <StandardChapterEditBlocks
        v-model:blocks="mixedBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        :image-collection-id="sharedProps.config.imageCollectionId"
        template="devotion"
        chapter-type="Day"
      />
    </Variant>

    <Variant title="Reuse previous structure">
      <StandardChapterEditBlocks
        v-model:blocks="emptyBlocks"
        :previous-chapter-blocks="previousChapterBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        :image-collection-id="sharedProps.config.imageCollectionId"
        template="devotion"
        chapter-type="Day"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { ChapterBlock } from '../../../types';
import {
  mockResourceProviders,
  sampleMixedChapterBlocks,
  samplePreviousCourseChapterBlocks,
  samplePreviousDevotionChapterBlocks,
  sharedProps,
} from '../../test/mocks';
import { useWidgetsStore } from '../../store';
import type { StoryHandler } from '../../shared/helpers';
import StandardChapterEditBlocks from './standard-chapter-edit-blocks.vue';
import { createEmptyContentBlock, createContentItem } from './blocks/block-utils';

const setupProviders: StoryHandler = (): void => {
  useWidgetsStore().setProviders(mockResourceProviders);
};

const defaultBlocks = ref<ChapterBlock[]>([createEmptyContentBlock()]);
const emptyBlocks = ref<ChapterBlock[]>([]);
const previousChapterBlocks = samplePreviousDevotionChapterBlocks;
const courseBlocks = ref<ChapterBlock[]>([...samplePreviousCourseChapterBlocks]);
const mixedBlocks = ref<ChapterBlock[]>([...sampleMixedChapterBlocks]);

const devotionBlocks = ref<ChapterBlock[]>([
  {
    ...createEmptyContentBlock(),
    blockName: 'Opening',
    displayName: 'Opening Devotion',
    blockRole: 'introduction',
    content: "Welcome to today's devotion.",
  },
  {
    ...createEmptyContentBlock(),
    blockName: 'Passage',
    displayName: 'Scripture Reading',
    blockRole: 'scripture',
    content: '',
    items: [createContentItem('scripture')],
  },
]);
</script>

<docs lang="md">
# Standard Chapter Edit Blocks

Shared block editor for standard chapter templates. Pass `template` to choose
scripture-block support and block roles (`course` vs `devotion`).
</docs>
