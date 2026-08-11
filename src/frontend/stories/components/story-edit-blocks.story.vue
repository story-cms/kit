<template>
  <Story title="Story Edit Blocks" group="stories" :setup-app="setupProviders">
    <Variant title="Default">
      <StoryEditBlocks
        v-model:blocks="defaultBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>

    <Variant title="Empty">
      <StoryEditBlocks
        v-model:blocks="emptyBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>

    <Variant title="Multiple blocks">
      <StoryEditBlocks
        v-model:blocks="multipleBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>

    <Variant title="Mixed block kinds">
      <StoryEditBlocks
        v-model:blocks="mixedBlocks"
        :video-collection-id="sharedProps.config.videoCollectionId"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { StoryBlock } from '../../../types';
import { mockResourceProviders, sharedProps } from '../../test/mocks';
import { useWidgetsStore } from '../../store';
import type { StoryHandler } from '../../shared/helpers';
import StoryEditBlocks from './story-edit-blocks.vue';
import {
  createEmptyBlock,
  createEmptyScriptureBlock,
  createEmptyTitleBlock,
} from './block-utils';

const setupProviders: StoryHandler = (): void => {
  useWidgetsStore().setProviders(mockResourceProviders);
};

const defaultBlocks = ref<StoryBlock[]>([createEmptyBlock()]);

const emptyBlocks = ref<StoryBlock[]>([]);

const multipleBlocks = ref<StoryBlock[]>([
  {
    ...createEmptyBlock(),
    blockName: 'Introduction',
    displayName: 'Session Introduction',
    blockRole: 'introduction',
    style: 'default',
    blockType: 'text',
    content: 'Welcome to this session.',
  },
  {
    ...createEmptyBlock(),
    blockName: 'External Link',
    displayName: 'Further Reading',
    blockRole: 'summary',
    style: 'default',
    blockType: 'url',
    url: 'https://example.com/article',
  },
  {
    ...createEmptyBlock(),
    blockName: 'Summary',
    displayName: 'Session Summary',
    blockRole: 'summary',
    style: 'emphasis',
    blockType: 'text',
    content: 'Key takeaways from today.',
    visibility: { presenter: true, personal: false, hidden: false },
  },
  {
    ...createEmptyBlock(),
    blockName: 'Session Video',
    displayName: 'Watch Session',
    blockRole: 'introduction',
    style: 'default',
    blockType: 'video',
  },
  createEmptyBlock(),
]);

const mixedBlocks = ref<StoryBlock[]>([
  {
    ...createEmptyTitleBlock(),
    blockName: 'Session Title',
    title: 'The Gospel of John',
    style: 'emphasis',
  },
  {
    ...createEmptyBlock(),
    blockName: 'Introduction',
    displayName: 'Welcome',
    content: 'Welcome to this session.',
  },
  {
    ...createEmptyScriptureBlock(),
    blockName: 'Opening Passage',
    scripture: {
      reference: 'John 1:1',
      verse: 'In the beginning was the Word, and the Word was with God.',
    },
  },
]);
</script>

<docs lang="md">
# Story Edit Blocks

Content block editor for the Blocks tab on story create/edit pages. Supports content, title, and scripture blocks with add, remove, reorder, collapse, visibility toggles, and leaders notes.
</docs>
