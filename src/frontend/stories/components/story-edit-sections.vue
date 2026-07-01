<template>
  <div class="space-y-6">
    <PanelList
      v-if="hasSections || !shared.isTranslation"
      :field="sectionsField"
      :is-nested="true"
      :section-type="sectionType"
      :header-icon="tabIcon"
    />
    <p
      v-if="!hasSections"
      class="w-full shrink-0 grow-0 self-stretch text-center font-dmsans text-base font-normal leading-7 text-[#102F35]"
    >
      There are currently no sections defined for this story.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

import { useModelStore, useSharedStore } from '../../store';
import PanelList from './panel-list.vue';

const props = withDefaults(
  defineProps<{
    tabIcon?: string | Component;
    sectionType?: string | null;
  }>(),
  { tabIcon: '', sectionType: 'Section' },
);

const sectionType = computed(() => props.sectionType || 'Section');

const model = useModelStore();
const shared = useSharedStore();

const hasSections = computed(() => {
  const sections = shared.isTranslation
    ? model.getSourceField('sections', [])
    : model.getField('sections', []);

  return (sections as unknown[]).length > 0;
});

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
      noMarkup: true,
      minimal: true,
      toolbar: [],
    },
  ],
};
</script>
