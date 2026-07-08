<template>
  <div
    v-if="page.isDivider"
    class="flex min-w-0 items-center gap-3 overflow-hidden px-4 py-3 transition-colors"
    :class="[{ 'opacity-50': isDragging }]"
    :draggable="canDrag"
    @dragstart="onDragStart"
    @dragover.prevent="onDragOver"
    @drop.prevent="onDrop"
    @dragend="onDragEnd"
  >
    <GripVertical
      v-if="canDrag"
      class="size-4 shrink-0 cursor-move text-gray-400"
      aria-hidden="true"
    />
    <div class="relative min-w-0 flex-1">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-300" />
      </div>
    </div>
    <button
      type="button"
      class="shrink-0 rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
      aria-label="Remove divider"
      @click="emit('removeDivider')"
    >
      <Trash2 class="size-4" aria-hidden="true" />
    </button>
  </div>

  <div
    v-else
    class="flex min-w-0 items-center gap-3 overflow-hidden px-4 py-3 transition-colors"
    :class="[canDrag ? 'hover:bg-gray-50' : '', { 'opacity-50': isDragging }]"
    :draggable="canDrag"
    @dragstart="onDragStart"
    @dragover.prevent="onDragOver"
    @drop.prevent="onDrop"
    @dragend="onDragEnd"
  >
    <GripVertical
      v-if="canDrag"
      class="size-4 shrink-0 cursor-move text-gray-400"
      aria-hidden="true"
    />
    <button
      type="button"
      class="group/edit flex min-w-0 flex-1 items-center gap-3 overflow-hidden text-left"
      @click="emit('tap', page.id)"
    >
      <img
        v-if="page.icon"
        :src="page.icon"
        :alt="pageTitle"
        class="size-10 shrink-0 rounded-xl object-cover"
      />
      <div class="min-w-0 flex-1 basis-0 overflow-hidden">
        <p
          class="block min-w-0 truncate text-sm font-medium text-gray-900 transition-opacity group-hover/edit:opacity-70"
        >
          {{ pageTitle }}
        </p>
        <p
          v-if="page.description"
          class="mt-1 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500 transition-opacity group-hover/edit:opacity-70"
        >
          {{ page.description }}
        </p>
      </div>
    </button>
    <div class="flex shrink-0 items-center gap-2">
      <span
        v-if="page.isPublished"
        class="shrink-0 rounded-xl bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
      >
        Live
      </span>
      <Link2 v-if="isLink" class="size-4 shrink-0 text-gray-500" aria-hidden="true" />
      <Menu v-else class="size-4 shrink-0 text-gray-500" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GripVertical, Link2, Menu, Trash2 } from '@lucide/vue';
import type { PageItem } from '../../types';
import { padZero } from '../shared/helpers';

const props = defineProps<{
  page: PageItem;
  isDragging?: boolean;
}>();

const emit = defineEmits<{
  tap: [id: number];
  removeDivider: [];
  dragstart: [];
  dragover: [];
  drop: [];
  dragend: [];
}>();

const canDrag = computed(() => props.page.isPublished === true);

const pageTitle = computed(() =>
  props.page.title === null ||
  props.page.title === undefined ||
  props.page.title === ''
    ? `Page ${padZero(props.page.id)}`
    : props.page.title,
);

const isLink = computed(() => {
  if (props.page.body === null || props.page.body === undefined) return false;
  return (
    props.page.body.startsWith('http://') || props.page.body.startsWith('https://')
  );
});

const onDragStart = () => {
  if (!canDrag.value) return;
  emit('dragstart');
};

const onDragOver = () => {
  if (!canDrag.value) return;
  emit('dragover');
};

const onDrop = () => {
  if (!canDrag.value) return;
  emit('drop');
};

const onDragEnd = () => {
  if (!canDrag.value) return;
  emit('dragend');
};
</script>
