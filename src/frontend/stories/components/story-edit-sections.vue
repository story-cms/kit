<template>
  <div class="space-y-8">
    <PanelList
      :field="sectionsField"
      :is-nested="true"
      :section-type="sectionType"
      :header-icon="tabIcon"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import PanelList from './panel-list.vue';

const props = withDefaults(
  defineProps<{
    tabIcon?: string;
    sectionType?: string | null;
  }>(),
  { tabIcon: '', sectionType: 'Section' },
);

const sectionType = computed(() => props.sectionType || 'Section');

const sectionsField = {
  label: 'Section',
  name: 'sections',
  widget: 'sectionPanel',
  fields: [
    {
      label: 'Title',
      name: 'title',
      widget: 'string',
    },
    {
      label: 'Description',
      name: 'description',
      widget: 'markdown',
      toolbar: [],
    },
  ],
};
</script>
