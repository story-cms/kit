<template>
  <div class="space-y-8">
    <SectionPanelField :field="resourcesField" :is-nested="true" />
  </div>
</template>

<script setup lang="ts">
import SectionPanelField from '../../fields/section-panel-field.vue';

const resourcesField = {
  label: 'Resource',
  name: 'resources',
  widget: 'sectionPanel',
  fields: [
    { label: 'Title', name: 'title', widget: 'string' },
    { label: 'URL', name: 'url', widget: 'string' },
    { label: 'Summary', name: 'summary', widget: 'markdown' },
  ],
};
</script>
