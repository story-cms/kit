<template>
  <Story title="Resource Attached Item" group="resources" :layout="{ type: 'grid', width: 800 }">
    <Variant title="Default">
      <ResourceAttachedItem
        :item="availableResources[0]"
        @remove="onRemove"
      />
    </Variant>

    <Variant title="Leader visibility">
      <ResourceAttachedItem
        :item="availableResources[6]"
        @remove="onRemove"
      />
    </Variant>

    <Variant title="Read only">
      <ResourceAttachedItem
        :item="availableResources[0]"
        :read-only="true"
      />
    </Variant>

    <Variant title="Dragging">
      <ResourceAttachedItem
        :item="availableResources[0]"
        :is-dragging="true"
        @remove="onRemove"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourceAttachedItem from './resource-attached-item.vue';
import { availableResources } from '../../test/mocks';

const onRemove = () => {
  alert('Remove resource');
};
</script>
