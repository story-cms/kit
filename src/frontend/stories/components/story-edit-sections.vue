<template>
  <div class="space-y-8">
    <SectionPanelField :field="sectionsField" :header-icon="tabIcon" :is-nested="true" />
  </div>
</template>

<script setup lang="ts">
import SectionPanelField from '../../fields/section-panel-field.vue';

withDefaults(
  defineProps<{
    tabIcon?: string;
  }>(),
  { tabIcon: '' },
);

const sectionsField = {
  label: 'Section',
  name: 'sections',
  widget: 'sectionPanel',
  index: 'scripture.reference',
  fields: [
    {
      label: 'Scripture',
      name: 'scripture',
      widget: 'scripture',
    },
    {
      label: 'Commentary',
      name: 'commentary',
      widget: 'markdown',
    },
  ],
};
</script>
