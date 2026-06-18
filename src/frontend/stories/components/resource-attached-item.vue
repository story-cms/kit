<template>
  <div
    class="flex min-w-0 items-center gap-3 overflow-hidden px-4 py-3 transition-colors"
    :class="[
      readOnly ? '' : 'hover:bg-gray-50',
      { 'opacity-50': isDragging },
    ]"
    :draggable="!readOnly"
    @dragstart="onDragStart"
    @dragover.prevent="onDragOver"
    @drop.prevent="onDrop"
    @dragend="onDragEnd"
  >
    <GripVertical
      v-if="!readOnly"
      class="size-4 shrink-0 cursor-move text-gray-400"
      aria-hidden="true"
    />
    <ResourceThumbnail :item="item" />
    <div class="min-w-0 flex-1 basis-0 overflow-hidden">
      <div class="flex min-w-0 items-center gap-2 overflow-hidden">
        <h4 class="min-w-0 shrink truncate text-sm font-medium text-gray-900">
          {{ item.title }}
        </h4>
        <ResourceTypeBadge :type="item.type" />
        <span
          v-if="item.visibility !== 'public'"
          class="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-700"
        >
          {{ item.visibility }}
        </span>
      </div>
      <p
        v-if="item.description"
        class="mt-1 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500"
      >
        {{ item.description }}
      </p>
    </div>
    <button
      v-if="!readOnly"
      type="button"
      class="shrink-0 rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
      aria-label="Remove resource"
      @click="emit('remove')"
    >
      <X class="size-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { GripVertical, X } from '@lucide/vue';
import ResourceThumbnail from './resource-thumbnail.vue';
import ResourceTypeBadge from './resource-type-badge.vue';
import type { Resource } from '../../../types';

const props = defineProps<{
  item: Resource;
  isDragging?: boolean;
  readOnly?: boolean;
}>();

const emit = defineEmits<{
  remove: [];
  dragstart: [];
  dragover: [];
  drop: [];
  dragend: [];
}>();

const onDragStart = () => {
  if (!props.readOnly) emit('dragstart');
};

const onDragOver = () => {
  if (!props.readOnly) emit('dragover');
};

const onDrop = () => {
  if (!props.readOnly) emit('drop');
};

const onDragEnd = () => {
  if (!props.readOnly) emit('dragend');
};
</script>
