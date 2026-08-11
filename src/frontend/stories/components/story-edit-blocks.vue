<template>
  <div class="min-w-0 space-y-6 overflow-x-clip">
    <BlockEmptyState v-if="blocks.length === 0" />

    <template v-for="(block, index) in blocks" :key="block.id">
      <ContentBlockCard
        v-if="isContentBlock(block)"
        :block="block"
        :expanded="isExpanded(index)"
        :video-collection-id="videoCollectionId"
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
        :expanded="isExpanded(index)"
        @update:block="updateBlock(index, $event)"
        @delete="deleteBlock(index)"
        @toggle="toggle(index)"
        @dragstart="onDragStart(index)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
      />
    </template>

    <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      <button
        type="button"
        class="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-studio-forest px-3 py-[18px] text-sm font-medium leading-4 text-studio-forest shadow-sm hover:bg-studio-lime"
        @click.prevent="addTitleBlock"
      >
        <div class="inline-flex items-center justify-center gap-2">
          <Plus class="size-5" aria-hidden="true" />
          <span>Add Title Block</span>
        </div>
      </button>
      <button
        type="button"
        class="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-studio-forest px-3 py-[18px] text-sm font-medium leading-4 text-studio-forest shadow-sm hover:bg-studio-lime"
        @click.prevent="addScriptureBlock"
      >
        <div class="inline-flex items-center justify-center gap-2">
          <Plus class="size-5" aria-hidden="true" />
          <span>Add Scripture Block</span>
        </div>
      </button>
      <button
        type="button"
        class="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-studio-forest px-3 py-[18px] text-sm font-medium leading-4 text-studio-forest shadow-sm hover:bg-studio-lime"
        @click.prevent="addContentBlock"
      >
        <div class="inline-flex items-center justify-center gap-2">
          <Plus class="size-5" aria-hidden="true" />
          <span>Add Content Block</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Plus } from '@lucide/vue';

import type { StoryBlock, StoryContentBlock } from '../../../types';
import BlockEmptyState from './block-empty-state.vue';
import ContentBlockCard from './content-block-card.vue';
import ScriptureBlockCard from './scripture-block-card.vue';
import TitleBlockCard from './title-block-card.vue';
import {
  blockKind,
  createEmptyBlock,
  createEmptyScriptureBlock,
  createEmptyTitleBlock,
} from './block-utils';

const props = defineProps<{
  blocks: StoryBlock[];
  videoCollectionId?: string;
}>();

const emit = defineEmits<{
  'update:blocks': [blocks: StoryBlock[]];
}>();

const blocks = computed({
  get: () => props.blocks,
  set: (value: StoryBlock[]) => emit('update:blocks', value),
});

const expanded = ref<boolean[]>([]);

const syncExpanded = () => {
  const count = blocks.value.length;
  if (expanded.value.length === count) return;
  const fresh = [...expanded.value];
  while (fresh.length < count) fresh.push(true);
  fresh.length = count;
  expanded.value = fresh;
};

watch(blocks, syncExpanded, { deep: true, immediate: true });

const isContentBlock = (block: StoryBlock): block is StoryContentBlock =>
  blockKind(block) === 'content';

const isExpanded = (index: number): boolean => expanded.value[index] ?? true;

const toggle = (index: number) => {
  const fresh = [...expanded.value];
  fresh[index] = !isExpanded(index);
  expanded.value = fresh;
};

const updateBlock = (index: number, block: StoryBlock) => {
  const next = [...blocks.value];
  next[index] = block;
  blocks.value = next;
};

const addContentBlock = () => {
  blocks.value = [...blocks.value, createEmptyBlock()];
};

const addTitleBlock = () => {
  blocks.value = [...blocks.value, createEmptyTitleBlock()];
};

const addScriptureBlock = () => {
  blocks.value = [...blocks.value, createEmptyScriptureBlock()];
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
  toggles.splice(toIndex, 0, movedToggle ?? true);
  expanded.value = toggles;
  dragFromIndex.value = null;
};
</script>
