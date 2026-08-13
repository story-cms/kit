<template>
  <Story title="Chapter Edit Blocks" group="stories" :setup-app="setupProviders">
    <Variant title="Default">
      <ChapterEditBlocks
        v-model:blocks="defaultBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>

    <Variant title="Empty">
      <ChapterEditBlocks
        v-model:blocks="emptyBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>

    <Variant title="Multiple blocks">
      <ChapterEditBlocks
        v-model:blocks="multipleBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>

    <Variant title="Mixed block kinds">
      <ChapterEditBlocks
        v-model:blocks="mixedBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { ChapterBlock } from '../../../types';
import { mockResourceProviders, sampleMixedChapterBlocks, sharedProps } from '../../test/mocks';
import { useWidgetsStore } from '../../store';
import type { StoryHandler } from '../../shared/helpers';
import ChapterEditBlocks from './chapter-edit-blocks.vue';
import { createEmptyContentBlock } from './chapter-blocks/chapter-block-utils';

const setupProviders: StoryHandler = (): void => {
  useWidgetsStore().setProviders(mockResourceProviders);
};

const defaultBlocks = ref<ChapterBlock[]>([createEmptyContentBlock()]);

const emptyBlocks = ref<ChapterBlock[]>([]);

const multipleBlocks = ref<ChapterBlock[]>([
  {
    ...createEmptyContentBlock(),
    blockName: 'Introduction',
    displayName: 'Session Introduction',
    blockRole: 'introduction',
    style: 'default',
    blockType: 'text',
    content: 'Welcome to this session.',
  },
  {
    ...createEmptyContentBlock(),
    blockName: 'External Link',
    displayName: 'Further Reading',
    blockRole: 'summary',
    style: 'default',
    blockType: 'url',
    url: 'https://example.com/article',
  },
  {
    ...createEmptyContentBlock(),
    blockName: 'Summary',
    displayName: 'Session Summary',
    blockRole: 'summary',
    style: 'emphasis',
    blockType: 'text',
    content: 'Key takeaways from today.',
    visibility: { presenter: true, personal: false, inNavigation: true, hidden: false },
  },
  {
    ...createEmptyContentBlock(),
    blockName: 'Session Video',
    displayName: 'Watch Session',
    blockRole: 'introduction',
    style: 'default',
    blockType: 'video',
  },
  createEmptyContentBlock(),
]);

const mixedBlocks = ref<ChapterBlock[]>([...sampleMixedChapterBlocks]);
</script>

<docs lang="md">
# Chapter Edit Blocks

Content block editor for the Blocks tab on chapter create/edit pages. Supports content, title, and scripture blocks with add, remove, reorder, collapse, visibility toggles, and leaders notes.
</docs>
