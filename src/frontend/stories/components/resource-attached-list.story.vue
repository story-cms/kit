<template>
  <Story
    title="Resource Attached List"
    group="resources"
    :layout="{ type: 'grid', width: 800 }"
  >
    <Variant title="Default">
      <ResourceAttachedList v-model:resources="attachedResources" />
    </Variant>

    <Variant title="Single label">
      <ResourceAttachedList v-model:resources="singleLabelResources" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ResourceAttachedList from './resource-attached-list.vue';
import { sampleAttachedResources } from '../../test/mocks';
import type { ResourceItem } from '../../../types';

const attachedResources = ref<ResourceItem[]>([...sampleAttachedResources]);

const singleLabelResources = ref<ResourceItem[]>(
  sampleAttachedResources.filter((resource) => resource.label === 'Supplementary Videos'),
);
</script>
