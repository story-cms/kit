<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-600">
        <span class="font-medium">{{ resources.length }}</span>
        resource{{ resources.length !== 1 ? 's' : '' }} attached
      </p>
      <p v-if="!readOnly" class="text-xs text-gray-500">
        Drag to reorder labels and resources
      </p>
    </div>

    <ResourceLabelGroup
      v-for="(label, labelIndex) in labels"
      :key="label"
      :label="label"
      :resources="groupedByLabel[label] ?? []"
      :label-index="labelIndex"
      :dragging-label-index="readOnly ? null : draggingLabelIndex"
      :dragging-resource="readOnly ? null : draggingResource"
      :read-only="readOnly"
      @label-dragstart="onLabelDragStart"
      @label-dragover="onLabelDragOver"
      @label-dragend="onDragEnd"
      @resource-dragstart="onResourceDragStart"
      @resource-dragover="onResourceDragOver"
      @resource-dragend="onDragEnd"
      @remove="removeResource"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ResourceLabelGroup from './resource-label-group.vue';
import { groupResourcesByLabel, orderedLabels } from './resource-utils';
import type { ResourceItem } from '../../../types';

const props = defineProps<{
  resources: ResourceItem[];
  readOnly?: boolean;
}>();

const emit = defineEmits<{
  'update:resources': [resources: ResourceItem[]];
}>();

const attachedResources = computed({
  get: () => props.resources,
  set: (value: ResourceItem[]) => emit('update:resources', value),
});

const groupedByLabel = computed(() => groupResourcesByLabel(attachedResources.value));

const labels = computed(() => orderedLabels(attachedResources.value));

const removeResource = (resourceId: string) => {
  attachedResources.value = attachedResources.value.filter(
    (resource) => resource.id !== resourceId,
  );
};

const moveLabel = (dragIndex: number, hoverIndex: number) => {
  if (dragIndex === hoverIndex) return;

  const currentLabels = [...labels.value];
  const groups = { ...groupedByLabel.value };
  const draggedLabel = currentLabels[dragIndex];
  if (!draggedLabel) return;

  currentLabels.splice(dragIndex, 1);
  currentLabels.splice(hoverIndex, 0, draggedLabel);
  attachedResources.value = currentLabels.flatMap((label) => groups[label] ?? []);
};

const moveResourceWithinLabel = (
  label: string,
  dragIndex: number,
  hoverIndex: number,
) => {
  if (dragIndex === hoverIndex) return;

  const groups = groupedByLabel.value;
  const resourcesInLabel = [...(groups[label] ?? [])];
  const draggedResource = resourcesInLabel[dragIndex];
  if (!draggedResource) return;

  resourcesInLabel.splice(dragIndex, 1);
  resourcesInLabel.splice(hoverIndex, 0, draggedResource);

  const updatedGroups = { ...groups, [label]: resourcesInLabel };
  attachedResources.value = labels.value.flatMap(
    (groupLabel) => updatedGroups[groupLabel] ?? [],
  );
};

const draggingLabelIndex = ref<number | null>(null);
const draggingResource = ref<{ label: string; index: number } | null>(null);

const onDragEnd = () => {
  draggingLabelIndex.value = null;
  draggingResource.value = null;
};

const onLabelDragStart = (labelIndex: number) => {
  draggingLabelIndex.value = labelIndex;
  draggingResource.value = null;
};

const onLabelDragOver = (labelIndex: number) => {
  if (draggingLabelIndex.value === null) return;
  if (draggingLabelIndex.value === labelIndex) return;

  moveLabel(draggingLabelIndex.value, labelIndex);
  draggingLabelIndex.value = labelIndex;
};

const onResourceDragStart = (label: string, resourceIndex: number) => {
  draggingResource.value = { label, index: resourceIndex };
  draggingLabelIndex.value = null;
};

const onResourceDragOver = (label: string, resourceIndex: number) => {
  if (!draggingResource.value) return;
  if (draggingResource.value.label !== label) return;
  if (draggingResource.value.index === resourceIndex) return;

  moveResourceWithinLabel(label, draggingResource.value.index, resourceIndex);
  draggingResource.value = { label, index: resourceIndex };
};
</script>
