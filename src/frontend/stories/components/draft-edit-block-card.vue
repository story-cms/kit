<template>
  <ContentBlockCard
    v-if="isContentBlock(block)"
    :block="block"
    :block-index="blockIndex"
    :expanded="expanded"
    :video-collection-id="videoCollectionId"
    :image-collection-id="imageCollectionId"
    :chapter-type="chapterType"
    :template="template"
    :read-only="readOnly"
    :translation-mode="translationMode"
    @update:block="emit('update:block', $event)"
    @delete="emit('delete')"
    @toggle="emit('toggle')"
    @dragstart="emit('dragstart')"
    @drop="emit('drop')"
    @dragend="emit('dragend')"
  />
  <TitleBlockCard
    v-else-if="block.kind === 'title'"
    :block="block"
    :block-index="blockIndex"
    :expanded="expanded"
    :image-collection-id="imageCollectionId"
    :read-only="readOnly"
    :translation-mode="translationMode"
    @update:block="emit('update:block', $event)"
    @delete="emit('delete')"
    @toggle="emit('toggle')"
    @dragstart="emit('dragstart')"
    @drop="emit('drop')"
    @dragend="emit('dragend')"
  />
  <ScriptureBlockCard
    v-else-if="block.kind === 'scripture'"
    :block="block"
    :block-index="blockIndex"
    :expanded="expanded"
    :read-only="readOnly"
    :translation-mode="translationMode"
    @update:block="emit('update:block', $event)"
    @delete="emit('delete')"
    @toggle="emit('toggle')"
    @dragstart="emit('dragstart')"
    @drop="emit('drop')"
    @dragend="emit('dragend')"
  />
</template>

<script setup lang="ts">
import type { ChapterBlock, ChapterContentBlock } from '../../../types';
import ContentBlockCard from './blocks/content-block-card.vue';
import ScriptureBlockCard from './blocks/scripture-block-card.vue';
import TitleBlockCard from './blocks/title-block-card.vue';
import { blockKind } from './blocks/block-utils';

defineProps<{
  block: ChapterBlock;
  blockIndex: number;
  expanded: boolean;
  videoCollectionId?: string;
  imageCollectionId?: string;
  chapterType?: string | null;
  template?: string | null;
  readOnly?: boolean;
  translationMode?: boolean;
}>();

const emit = defineEmits<{
  'update:block': [block: ChapterBlock];
  delete: [];
  toggle: [];
  dragstart: [];
  drop: [];
  dragend: [];
}>();

const isContentBlock = (block: ChapterBlock): block is ChapterContentBlock =>
  blockKind(block) === 'content';
</script>
