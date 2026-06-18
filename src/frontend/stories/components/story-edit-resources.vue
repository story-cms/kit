<template>
  <div class="grid min-w-0 grid-cols-[minmax(0,1fr)] overflow-x-clip">
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ResourceAttachedList from './resource-attached-list.vue';
import ResourceEmptyState from './resource-empty-state.vue';
import ResourcePicker from './resource-picker.vue';
import type { Resource } from '../../../types';

const props = defineProps<{
  resources: Resource[];
  availableResources: Resource[];
}>();

const emit = defineEmits<{
  'update:resources': [resources: Resource[]];
  create: [];
}>();

const resourcePicker = ref<InstanceType<typeof ResourcePicker> | null>(null);

const attachedResources = computed({
  get: () => props.resources,
  set: (value: Resource[]) => emit('update:resources', value),
});

const attachResource = (resource: Resource) => {
  if (attachedResources.value.some((attached) => attached.id === resource.id)) return;
  attachedResources.value = [...attachedResources.value, resource];
};
</script>
