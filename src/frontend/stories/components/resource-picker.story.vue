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
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ResourcePicker from './resource-picker.vue';
import { availableResources } from '../../test/mocks';
import type { Resource } from '../../../types';

const attachedResources = ref<Resource[]>([]);

const onAttach = (resource: Resource) => {
  attachedResources.value = [...attachedResources.value, resource];
};

const onCreate = () => {
  alert('Create new resource');
};
</script>
