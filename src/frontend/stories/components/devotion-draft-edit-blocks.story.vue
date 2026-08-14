<template>
  <Story title="Devotion Draft Edit Blocks" group="stories" :setup-app="setupProviders">
    <Variant title="Default">
      <DevotionDraftEditBlocks
        v-model:blocks="defaultBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>

    <Variant title="Empty">
      <DevotionDraftEditBlocks
        v-model:blocks="emptyBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>

    <Variant title="Multiple blocks">
      <DevotionDraftEditBlocks
        v-model:blocks="multipleBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>

    <Variant title="Mixed block kinds">
      <DevotionDraftEditBlocks
        v-model:blocks="mixedBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>

    <Variant title="Devotion">
      <DevotionDraftEditBlocks
        v-model:blocks="devotionBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        chapter-type="Devotion"
      />
    </Variant>

    <Variant title="Reuse previous structure">
      <DevotionDraftEditBlocks
        v-model:blocks="emptyBlocks"
        :previous-chapter-blocks="previousChapterBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
        chapter-type="Devotion"
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
  samplePreviousDevotionChapterBlocks,
  sharedProps,
} from '../../test/mocks';
import { useWidgetsStore } from '../../store';
import type { StoryHandler } from '../../shared/helpers';
import DevotionDraftEditBlocks from './devotion-draft-edit-blocks.vue';
import { createEmptyContentBlock, createContentItem } from './blocks/block-utils';

const setupProviders: StoryHandler = (): void => {
  useWidgetsStore().setProviders(mockResourceProviders);
};

const defaultBlocks = ref<ChapterBlock[]>([createEmptyContentBlock()]);

const emptyBlocks = ref<ChapterBlock[]>([]);

const previousChapterBlocks = samplePreviousDevotionChapterBlocks;

const multipleBlocks = ref<ChapterBlock[]>([
  {
    ...createEmptyContentBlock(),
    blockName: 'Introduction',
    displayName: 'Session Introduction',
    blockRole: 'introduction',
    style: 'primary',
    content: 'Welcome to this session.',
  },
  {
    ...createEmptyContentBlock(),
    blockName: 'External Link',
    displayName: 'Further Reading',
    blockRole: 'summary',
    style: 'secondary',
    content: 'https://example.com/article',
  },
  {
    ...createEmptyContentBlock(),
    blockName: 'Summary',
    displayName: 'Session Summary',
    blockRole: 'summary',
    style: 'primary',
    content: 'Key takeaways from today.',
    visibility: { presenter: true, personal: false, inNavigation: true, hidden: false },
  },
  {
    ...createEmptyContentBlock(),
    blockName: 'Session Video',
    displayName: 'Watch Session',
    blockRole: 'introduction',
    style: 'tertiary',
    content: '',
    items: [createContentItem('video')],
  },
  createEmptyContentBlock(),
]);

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
# Devotion Draft Edit Blocks

Content block editor for the Blocks tab on devotion draft edit pages. Supports content, title, and scripture blocks with add, remove, reorder, collapse, visibility toggles, leaders notes, and reuse previous structure on chapter 2+.
</docs>
