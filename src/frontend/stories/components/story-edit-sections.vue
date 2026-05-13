<template>
  <div class="space-y-8 px-6">
    <SectionPanelField
      :field="sectionsField"
      :is-nested="true"
      class="px-8"
    />
  </div>
</template>

<script setup lang="ts">
import SectionPanelField from '../../fields/section-panel-field.vue';

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
