<template>
  <div class="min-w-0 space-y-6 overflow-x-clip">
    <ResourcePicker
      :available-resources="availableResources"
      :attached-resources="attachedResources"
      @attach="attachResource"
      @create="emit('create')"
    />

    <ResourceEmptyState v-if="attachedResources.length === 0" />

    <ResourceAttachedList v-else v-model:resources="attachedResources" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ResourceAttachedList from './resource-attached-list.vue';
import ResourceEmptyState from './resource-empty-state.vue';
import ResourcePicker from './resource-picker.vue';
import type { ResourceItem } from '../../../types';

const props = defineProps<{
  resources: ResourceItem[];
  availableResources: ResourceItem[];
}>();

const emit = defineEmits<{
  'update:resources': [resources: ResourceItem[]];
  create: [];
}>();

const attachedResources = computed({
  get: () => props.resources,
  set: (value: ResourceItem[]) => emit('update:resources', value),
});

const attachResource = (resource: ResourceItem) => {
  if (attachedResources.value.some((attached) => attached.id === resource.id)) return;
  attachedResources.value = [...attachedResources.value, resource];
};
</script>
