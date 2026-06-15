<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Edit Story"> </ContentHeader>
    </template>

    <section class="px-8 py-6">
      <StoryEditResources
        v-model:resources="resources"
        :available-resources="library"
      />
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import StoryEditResources from './components/story-edit-resources.vue';
import { availableResources as mockAvailableResources, sampleAttachedResources } from '../test/mocks';
import type { Resource } from '../../types';

const props = withDefaults(
  defineProps<{
    availableResources?: Resource[];
    model?: { resources?: Resource[] };
  }>(),
  {
    availableResources: () => mockAvailableResources,
    model: () => ({ resources: sampleAttachedResources }),
  },
);

const library = props.availableResources;
const resources = ref<Resource[]>([...(props.model?.resources ?? [])]);
</script>
