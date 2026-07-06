<template>
  <Story title="Resource Picker" group="resources" :layout="{ type: 'grid', width: 800 }">
    <Variant title="Default">
      <ResourcePicker
        :available-resources="availableResources"
        :attached-resources="attachedResources"
        @attach="onAttach"
        @create="onCreate"
      />
    </Variant>

    <Variant title="Empty library">
      <ResourcePicker
        :available-resources="[]"
        :attached-resources="attachedResources"
        @attach="onAttach"
        @create="onCreate"
      />
    </Variant>

    <Variant title="Attach only">
      <ResourcePicker
        :available-resources="availableResources"
        :attached-resources="attachedResources"
        :allow-create="false"
        @attach="onAttach"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ResourcePicker from './resource-picker.vue';
import { availableResources } from '../../test/mocks';
import type { ResourceItem } from '../../../types';

const attachedResources = ref<ResourceItem[]>([]);

const onAttach = (resource: ResourceItem) => {
  attachedResources.value = [...attachedResources.value, resource];
};

const onCreate = () => {
  alert('Create new resource');
};
</script>
