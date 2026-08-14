<template>
  <div class="min-w-0 space-y-6 overflow-x-clip">
    <AddBlockToolbar
      v-if="blocks.length === 0"
      @add-title="addTitleBlock"
      @add-scripture="addScriptureBlock"
      @add-content="addContentBlock"
    />

    <BlockEmptyState
      v-if="blocks.length === 0"
      :error-message="blocksArrayError"
    />

    <template v-for="(block, index) in blocks" :key="block.id">
      <ContentBlockCard
        v-if="isContentBlock(block)"
        :block="block"
        :block-index="index"
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
      <TitleBlockCard
        v-else-if="block.kind === 'title'"
        :block="block"
        :block-index="index"
        :expanded="isExpanded(index)"
        @update:block="updateBlock(index, $event)"
        @delete="deleteBlock(index)"
        @toggle="toggle(index)"
        @dragstart="onDragStart(index)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
      />
      <ScriptureBlockCard
        v-else-if="block.kind === 'scripture'"
        :block="block"
        :block-index="index"
        :expanded="isExpanded(index)"
        @update:block="updateBlock(index, $event)"
        @delete="deleteBlock(index)"
        @toggle="toggle(index)"
        @dragstart="onDragStart(index)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
      />
    </template>

    <AddBlockToolbar
      v-if="blocks.length > 0"
      @add-title="addTitleBlock"
      @add-scripture="addScriptureBlock"
      @add-content="addContentBlock"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import type { ChapterBlock, ChapterContentBlock } from '../../../types';
import { useSharedStore } from '../../store';
import AddBlockToolbar from './blocks/add-block-toolbar.vue';
import BlockEmptyState from './blocks/block-empty-state.vue';
import { blockHasError, blocksArrayErrorMessages } from './blocks/block-field-errors';
import ContentBlockCard from './blocks/content-block-card.vue';
import ScriptureBlockCard from './blocks/scripture-block-card.vue';
import TitleBlockCard from './blocks/title-block-card.vue';
import {
  blockKind,
  createEmptyContentBlock,
  createEmptyScriptureBlock,
  createEmptyTitleBlock,
} from './blocks/block-utils';

const props = defineProps<{
  blocks: ChapterBlock[];
  videoCollectionId?: string;
  chapterType?: string | null;
}>();

const emit = defineEmits<{
  'update:blocks': [blocks: ChapterBlock[]];
}>();

const shared = useSharedStore();
const { errors } = storeToRefs(shared);

const blocks = computed({
  get: () => props.blocks,
  set: (value: ChapterBlock[]) => emit('update:blocks', value),
});

const blocksArrayError = computed(() => blocksArrayErrorMessages(errors.value)[0] ?? '');

const expanded = ref<boolean[]>([]);
const newlyAddedBlockId = ref<string | null>(null);
const hasInitialized = ref(false);

const expandSingleEmptyStarter = () => {
  if (blocks.value.length !== 1) return;
  const block = blocks.value[0];
  if (block.blockName.trim()) return;
  expanded.value = [true];
};

const expandErroredBlocks = () => {
  const count = blocks.value.length;
  if (count === 0) return;

  const fresh = [...expanded.value];
  while (fresh.length < count) fresh.push(false);

  let changed = false;
  for (let index = 0; index < count; index++) {
    if (blockHasError(errors.value, index) && !fresh[index]) {
      fresh[index] = true;
      changed = true;
    }
  }

  if (changed) {
    expanded.value = fresh;
  }
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
watch(errors, expandErroredBlocks, { deep: true, immediate: true });

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
