<template>
  <div class="space-y-8">
    <SectionPanelField
      :field="resourcesField"
      :header-icon="tabIcon"
      :is-nested="true"
    />
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
