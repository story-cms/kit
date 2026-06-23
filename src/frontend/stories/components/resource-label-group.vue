<template>
  <section
    class="overflow-hidden rounded-xl border border-gray-200 bg-white transition-opacity"
    :class="{ 'opacity-50': !readOnly && draggingLabelIndex === labelIndex }"
    @dragover.prevent="onLabelDragOver"
    @drop.prevent="onLabelDrop"
  >
    <div
      class="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3"
      :draggable="!readOnly"
      @dragstart="onLabelDragStart"
      @dragend="onLabelDragEnd"
    >
      <GripVertical
        v-if="!readOnly"
        class="size-4 cursor-move text-gray-400"
        aria-hidden="true"
      />
      <Tag class="size-4 text-blue-600" aria-hidden="true" />
      <span class="font-medium text-gray-900">{{ label }}</span>
      <span class="text-xs text-gray-500">({{ resources.length }})</span>
    </div>

    <div class="divide-y divide-gray-100">
      <ResourceAttachedItem
        v-for="(attachedItem, resourceIndex) in resources"
        :key="attachedItem.id"
        :item="attachedItem"
        :is-dragging="
          !readOnly &&
          draggingResource?.label === label &&
          draggingResource?.index === resourceIndex
        "
        :read-only="readOnly"
        @remove="emit('remove', attachedItem.id)"
        @dragstart="emit('resource-dragstart', label, resourceIndex)"
        @dragover="emit('resource-dragover', label, resourceIndex)"
        @drop="emit('resource-dragend')"
        @dragend="emit('resource-dragend')"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { GripVertical, Tag } from '@lucide/vue';
import ResourceAttachedItem from './resource-attached-item.vue';
import type { ResourceItem } from '../../../types';

const props = defineProps<{
  label: string;
  resources: ResourceItem[];
  labelIndex: number;
  draggingLabelIndex: number | null;
  draggingResource: { label: string; index: number } | null;
  readOnly?: boolean;
}>();

const emit = defineEmits<{
  'label-dragstart': [labelIndex: number];
  'label-dragover': [labelIndex: number];
  'label-dragend': [];
  'resource-dragstart': [label: string, resourceIndex: number];
  'resource-dragover': [label: string, resourceIndex: number];
  'resource-dragend': [];
  remove: [resourceId: string];
}>();

const onLabelDragStart = () => {
  if (!props.readOnly) emit('label-dragstart', props.labelIndex);
};

const onLabelDragOver = () => {
  if (!props.readOnly) emit('label-dragover', props.labelIndex);
};

const onLabelDrop = () => {
  if (!props.readOnly) emit('label-dragend');
};

const onLabelDragEnd = () => {
  if (!props.readOnly) emit('label-dragend');
};
</script>
