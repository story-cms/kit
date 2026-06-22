<template>
  <div
    class="grid min-w-0 overflow-x-clip"
    :class="isTranslation ? 'grid-cols-2 gap-x-4' : 'grid-cols-[minmax(0,1fr)]'"
  >
    <div class="min-w-0 space-y-6">
      <ResourcePicker
        ref="resourcePicker"
        :available-resources="availableResources"
        :attached-resources="attachedResources"
        @attach="attachResource"
        @create="emit('create')"
      />

      <ResourceEmptyState
        v-if="attachedResources.length === 0"
        @browse="resourcePicker?.openSearch()"
      />

      <ResourceAttachedList v-else v-model:resources="attachedResources" />
    </div>

    <div v-if="isTranslation" class="min-w-0 space-y-4">
      <h3 class="text-sm font-medium text-gray-700">Source locale resources</h3>
      <ResourceAttachedList
        v-if="sourceResources.length > 0"
        :resources="sourceResources"
        read-only
      />
      <p v-else class="text-sm text-gray-500">No resources attached in source locale</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ResourceAttachedList from './resource-attached-list.vue';
import ResourceEmptyState from './resource-empty-state.vue';
import ResourcePicker from './resource-picker.vue';
import type { ResourceItem } from '../../../types';

const props = withDefaults(
  defineProps<{
    resources: ResourceItem[];
    availableResources: ResourceItem[];
    isTranslation?: boolean;
    sourceResources?: ResourceItem[];
  }>(),
  {
    isTranslation: false,
    sourceResources: () => [],
  },
);

const emit = defineEmits<{
  'update:resources': [resources: ResourceItem[]];
  create: [];
}>();

const resourcePicker = ref<InstanceType<typeof ResourcePicker> | null>(null);

const attachedResources = computed({
  get: () => props.resources,
  set: (value: ResourceItem[]) => emit('update:resources', value),
});

const attachResource = (resource: ResourceItem) => {
  if (attachedResources.value.some((attached) => attached.id === resource.id)) return;
  attachedResources.value = [...attachedResources.value, resource];
};
</script>
