<template>
  <Story title="Resource Label Group" group="resources">
    <Variant title="Default">
      <ResourceLabelGroup
        label="Supplementary Videos"
        :resources="labelResources"
        :label-index="0"
        :dragging-label-index="null"
        :dragging-resource="null"
        @remove="onRemove"
      />
    </Variant>

    <Variant title="Readonly">
      <ResourceLabelGroup
        label="Supplementary Videos"
        :resources="labelResources"
        :label-index="0"
        :dragging-label-index="null"
        :dragging-resource="null"
        :read-only="true"
        @remove="onRemove"
      />
    </Variant>

    <Variant title="Dragging">
      <ResourceLabelGroup
        label="Supplementary Videos"
        :resources="labelResources"
        :label-index="0"
        :dragging-label-index="0"
        :dragging-resource="{ label: 'Supplementary Videos', index: 0 }"
        @remove="onRemove"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourceLabelGroup from './resource-label-group.vue';
import { sampleAttachedResources } from '../../test/mocks';

const labelResources = sampleAttachedResources.filter(
  (resource) => resource.label === 'Supplementary Videos',
);

const onRemove = () => {
  alert('Remove resource');
};
</script>

<docs lang="md">
# Resource Label Group

Grouped list of attached resources under a single label heading. Supports label and item
drag-and-drop reordering in the Resources tab.

## Variants

- **Default** — editable group with drag handles and remove actions
- **Readonly** — drag handles hidden; group is view-only
- **Dragging** — visual state while a label or resource is being dragged

## Props

- `label` — group heading text
- `resources` — attached resources in this group
- `labelIndex` — index of this label in the parent list (for drag reorder)
- `draggingLabelIndex` — currently dragged label index, or null
- `draggingResource` — currently dragged resource `{ label, index }`, or null
- `readOnly` — disables drag and remove interactions
</docs>
