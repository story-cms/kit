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

    <Variant title="Course with unsupported block" :setup-app="loadWithUnsupportedBlockError">
      <StandardChapterEditBlocks
        v-model:blocks="courseBlocksWithError"
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
  sampleMixedChapterBlocks,
  samplePreviousCourseChapterBlocks,
  samplePreviousDevotionChapterBlocks,
  sharedProps,
} from '../../test/mocks';
import { useSharedStore, useWidgetsStore } from '../../store';
import type { StoryHandler } from '../../shared/helpers';
import StandardChapterEditBlocks from './standard-chapter-edit-blocks.vue';
import {
  createContentItem,
  createEmptyContentBlock,
  createEmptyScriptureBlock,
} from './blocks/block-utils';

const setupProviders: StoryHandler = (): void => {
  useWidgetsStore().setProviders(mockResourceProviders);
};

const defaultBlocks = ref<ChapterBlock[]>([createEmptyContentBlock()]);
const emptyBlocks = ref<ChapterBlock[]>([]);
const previousChapterBlocks = samplePreviousDevotionChapterBlocks;
const courseBlocks = ref<ChapterBlock[]>([...samplePreviousCourseChapterBlocks]);
const mixedBlocks = ref<ChapterBlock[]>([...sampleMixedChapterBlocks]);

// Course chapters don't allow scripture blocks (only devotion chapters do). This
// mirrors data saved before that restriction existed, which fails validation on
// publish with a `bundle.blocks.<index>.kind` error.
const courseBlocksWithError = ref<ChapterBlock[]>([
  ...samplePreviousCourseChapterBlocks,
  createEmptyScriptureBlock(),
]);

const loadWithUnsupportedBlockError: StoryHandler = (): void => {
  useWidgetsStore().setProviders(mockResourceProviders);
  const errorBlockIndex = courseBlocksWithError.value.length - 1;
  useSharedStore().setErrors({
    [`bundle.blocks.${errorBlockIndex}.kind`]: [
      "This block type isn't supported for this chapter template",
    ],
  });
};

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

## Variants

- **Course with unsupported block** — a course chapter carrying a leftover
  scripture block (course chapters only allow content/title blocks). Publish
  validation reports a `bundle.blocks.<index>.kind` error; the block card's
  alert icon now surfaces that message via `title`/`aria-label` instead of
  showing no text at all.
</docs>
