<template>
  <div class="min-w-0 space-y-6 overflow-x-clip">
    <ChapterAddBlockToolbar
      v-if="blocks.length === 0"
      @add-title="addTitleBlock"
      @add-scripture="addScriptureBlock"
      @add-content="addContentBlock"
    />

    <ChapterBlockEmptyState v-if="blocks.length === 0" />

    <template v-for="(block, index) in blocks" :key="block.id">
      <ChapterContentBlockCard
        v-if="isContentBlock(block)"
        :block="block"
        :expanded="isExpanded(index)"
        :video-collection-id="videoCollectionId"
        :chapter-type="chapterType"
        @update:block="updateBlock(index, $event)"
        @delete="deleteBlock(index)"
        @toggle="toggle(index)"
        @dragstart="onDragStart(index)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
      />
      <ChapterTitleBlockCard
        v-else-if="block.kind === 'title'"
        :block="block"
        :expanded="isExpanded(index)"
        @update:block="updateBlock(index, $event)"
        @delete="deleteBlock(index)"
        @toggle="toggle(index)"
        @dragstart="onDragStart(index)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
      />
      <ChapterScriptureBlockCard
        v-else-if="block.kind === 'scripture'"
        :block="block"
        :expanded="isExpanded(index)"
        @update:block="updateBlock(index, $event)"
        @delete="deleteBlock(index)"
        @toggle="toggle(index)"
        @dragstart="onDragStart(index)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
      />
    </template>

    <ChapterAddBlockToolbar
      v-if="blocks.length > 0"
      @add-title="addTitleBlock"
      @add-scripture="addScriptureBlock"
      @add-content="addContentBlock"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { ChapterBlock, ChapterContentBlock } from '../../../types';
import ChapterAddBlockToolbar from './chapter-blocks/chapter-add-block-toolbar.vue';
import ChapterBlockEmptyState from './chapter-blocks/chapter-block-empty-state.vue';
import ChapterContentBlockCard from './chapter-blocks/chapter-content-block-card.vue';
import ChapterScriptureBlockCard from './chapter-blocks/chapter-scripture-block-card.vue';
import ChapterTitleBlockCard from './chapter-blocks/chapter-title-block-card.vue';
import {
  blockKind,
  createEmptyContentBlock,
  createEmptyScriptureBlock,
  createEmptyTitleBlock,
} from './chapter-blocks/chapter-block-utils';

const props = defineProps<{
  blocks: ChapterBlock[];
  videoCollectionId?: string;
  chapterType?: string | null;
}>();

const emit = defineEmits<{
  'update:blocks': [blocks: ChapterBlock[]];
}>();

const blocks = computed({
  get: () => props.blocks,
  set: (value: ChapterBlock[]) => emit('update:blocks', value),
});

const expanded = ref<boolean[]>([]);
const newlyAddedBlockId = ref<string | null>(null);
const hasInitialized = ref(false);

const expandSingleEmptyStarter = () => {
  if (blocks.value.length !== 1) return;
  const block = blocks.value[0];
  if (block.blockName.trim()) return;
  expanded.value = [true];
};

const syncExpanded = () => {
  const count = blocks.value.length;
  if (expanded.value.length === count) return;
  const fresh = [...expanded.value];
  while (fresh.length < count) {
    const block = blocks.value[fresh.length];
    fresh.push(block.id === newlyAddedBlockId.value);
  }
  fresh.length = count;
  expanded.value = fresh;
  newlyAddedBlockId.value = null;

  if (!hasInitialized.value) {
    hasInitialized.value = true;
    expandSingleEmptyStarter();
  }
};

watch(blocks, syncExpanded, { deep: true, immediate: true });

const isContentBlock = (block: ChapterBlock): block is ChapterContentBlock =>
  blockKind(block) === 'content';

const isExpanded = (index: number): boolean => expanded.value[index] ?? false;

const toggle = (index: number) => {
  const fresh = [...expanded.value];
  fresh[index] = !isExpanded(index);
  expanded.value = fresh;
};

const updateBlock = (index: number, block: ChapterBlock) => {
  const next = [...blocks.value];
  next[index] = block;
  blocks.value = next;
};

const appendBlock = (block: ChapterBlock) => {
  newlyAddedBlockId.value = block.id;
  blocks.value = [...blocks.value, block];
};

const addContentBlock = () => {
  appendBlock(createEmptyContentBlock());
};

const addTitleBlock = () => {
  appendBlock(createEmptyTitleBlock());
};

const addScriptureBlock = () => {
  appendBlock(createEmptyScriptureBlock());
};

const deleteBlock = (index: number) => {
  const next = [...blocks.value];
  next.splice(index, 1);
  blocks.value = next;

  const toggles = [...expanded.value];
  toggles.splice(index, 1);
  expanded.value = toggles;
};

const dragFromIndex = ref<number | null>(null);

const onDragStart = (index: number) => {
  dragFromIndex.value = index;
};

const onDragEnd = () => {
  dragFromIndex.value = null;
};

const onDrop = (toIndex: number) => {
  if (dragFromIndex.value === null) return;
  if (dragFromIndex.value === toIndex) return;

  const items = [...blocks.value];
  const [moved] = items.splice(dragFromIndex.value, 1);
  if (!moved) return;
  items.splice(toIndex, 0, moved);
  blocks.value = items;

  const toggles = [...expanded.value];
  const [movedToggle] = toggles.splice(dragFromIndex.value, 1);
  toggles.splice(toIndex, 0, movedToggle ?? false);
  expanded.value = toggles;
  dragFromIndex.value = null;
};
</script>
