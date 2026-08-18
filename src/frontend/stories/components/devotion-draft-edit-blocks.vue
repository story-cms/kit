<template>
  <div
    ref="translationGrid"
    :class="[
      'min-w-0 overflow-x-clip',
      isTranslation ? 'grid h-full gap-x-4 gap-y-6' : 'space-y-6',
      translationGridClasses,
    ]"
  >
    <template v-if="isTranslation">
      <BlockEmptyState v-if="blocks.length === 0" :error-message="blocksArrayError" />

      <template v-for="(block, index) in blocks" :key="block.id">
        <DraftEditBlockCard
          :block="block"
          :block-index="index"
          :expanded="isExpanded(index)"
          :video-collection-id="videoCollectionId"
          :image-collection-id="imageCollectionId"
          :chapter-type="chapterType"
          :translation-mode="true"
          @update:block="updateBlock(index, $event)"
          @delete="deleteBlock(index)"
          @toggle="onToggle(index)"
          @dragstart="onDragStart(index)"
          @drop="onDrop(index)"
          @dragend="onDragEnd"
        />

        <DraftEditBlockCard
          v-if="showSourceColumn && sourceBlocks[index]"
          :block="sourceBlocks[index]"
          :block-index="index"
          :expanded="isExpanded(index)"
          :video-collection-id="videoCollectionId"
          :image-collection-id="imageCollectionId"
          :chapter-type="chapterType"
          :read-only="true"
          :translation-mode="true"
          dir="ltr"
          @toggle="onToggle(index)"
        />
        <div v-else-if="showSourceColumn" aria-hidden="true" />
      </template>
    </template>

    <template v-else>
      <AddBlockToolbar
        v-if="blocks.length === 0"
        :show-reuse-previous="canReusePrevious"
        @add-title="addTitleBlock"
        @add-scripture="addScriptureBlock"
        @add-content="addContentBlock"
        @reuse-previous="reusePreviousStructure"
      />

      <BlockEmptyState v-if="blocks.length === 0" :error-message="blocksArrayError" />

      <template v-for="(block, index) in blocks" :key="block.id">
        <DraftEditBlockCard
          :block="block"
          :block-index="index"
          :expanded="isExpanded(index)"
          :video-collection-id="videoCollectionId"
          :image-collection-id="imageCollectionId"
          :chapter-type="chapterType"
          @update:block="updateBlock(index, $event)"
          @delete="deleteBlock(index)"
          @toggle="onToggle(index)"
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import type { ChapterBlock } from '../../../types';
import { useModelStore, useSharedStore } from '../../store';
import AddBlockToolbar from './blocks/add-block-toolbar.vue';
import BlockEmptyState from './blocks/block-empty-state.vue';
import { blockHasError, blocksArrayErrorMessages } from './blocks/block-field-errors';
import DraftEditBlockCard from './draft-edit-block-card.vue';
import {
  createEmptyContentBlock,
  createEmptyScriptureBlock,
  createEmptyTitleBlock,
  normalizedBlocks,
} from './blocks/block-utils';
import { cloneBlocksStructure } from '../../../shared/block_structure';
import { useTranslationBlockFieldAlignment } from './blocks/use-translation-block-field-alignment';

const props = withDefaults(
  defineProps<{
    blocks: ChapterBlock[];
    videoCollectionId?: string;
    imageCollectionId?: string;
    chapterType?: string | null;
    previousChapterBlocks?: ChapterBlock[];
    isTranslation?: boolean;
  }>(),
  {
    isTranslation: false,
  },
);

const emit = defineEmits<{
  'update:blocks': [blocks: ChapterBlock[]];
}>();

const shared = useSharedStore();
const model = useModelStore();
const { errors, showSourceColumn, isLargeScreen } = storeToRefs(shared);
const translationGrid = ref<HTMLElement | null>(null);

useTranslationBlockFieldAlignment(
  translationGrid,
  computed(() => props.isTranslation && showSourceColumn.value),
);

const blocks = computed({
  get: () => props.blocks,
  set: (value: ChapterBlock[]) => emit('update:blocks', value),
});

const sourceBlocks = computed(() => {
  const value = model.getSourceField('blocks', []);
  return Array.isArray(value) ? normalizedBlocks(value as ChapterBlock[]) : [];
});

const translationGridClasses = computed(() => {
  if (!props.isTranslation) return {};
  if (!showSourceColumn.value) return { 'grid-cols-1': true };
  if (!isLargeScreen.value) {
    return { 'grid-cols-[repeat(2,_minmax(440px,_1fr))] overflow-x-auto': true };
  }
  return { 'grid-cols-2 overflow-x-auto': true };
});

const blocksArrayError = computed(() => blocksArrayErrorMessages(errors.value)[0] ?? '');

const canReusePrevious = computed(
  () =>
    !props.isTranslation &&
    (props.previousChapterBlocks?.length ?? 0) > 0 &&
    blocks.value.length === 0,
);

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

const isExpanded = (index: number): boolean => expanded.value[index] ?? false;

const onToggle = (index: number) => {
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

const reusePreviousStructure = () => {
  if (!props.previousChapterBlocks?.length) return;

  const cloned = cloneBlocksStructure(normalizedBlocks([...props.previousChapterBlocks]));
  blocks.value = cloned;
  expanded.value = cloned.map((_, index) => index === 0);
  hasInitialized.value = true;
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
