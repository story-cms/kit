<template>
  <section
    class="overflow-hidden rounded-xl border border-gray-200 bg-white transition-opacity"
    :class="{ 'opacity-50': draggingLabelIndex === labelIndex }"
    @dragover.prevent="emit('label-dragover', labelIndex)"
    @drop.prevent="emit('label-dragend')"
  >
    <div
      class="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3"
      draggable="true"
      @dragstart="emit('label-dragstart', labelIndex)"
      @dragend="emit('label-dragend')"
    >
      <GripVertical class="size-4 cursor-move text-gray-400" aria-hidden="true" />
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
          draggingResource?.label === label && draggingResource?.index === resourceIndex
        "
        @remove="emit('remove', attachedItem.id)"
        @dragstart="emit('resource-dragstart', label, resourceIndex)"
        @dragover.prevent="emit('resource-dragover', label, resourceIndex)"
        @drop.prevent="emit('resource-dragend')"
        @dragend="emit('resource-dragend')"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { GripVertical, Tag } from '@lucide/vue';
import ResourceAttachedItem from './resource-attached-item.vue';
import type { Resource } from '../../../types';

defineProps<{
  label: string;
  resources: Resource[];
  labelIndex: number;
  draggingLabelIndex: number | null;
  draggingResource: { label: string; index: number } | null;
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
</script>
