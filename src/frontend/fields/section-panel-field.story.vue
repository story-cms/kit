<template>
  <Story title="Section Panel Field" group="widgets">
    <Variant title="Default" :setup-app="loadData">
      <SectionPanelField :field="sectionsSpec" />
      <ModelControl :model="listModel" />
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <SectionPanelField :field="sectionsSpec" :is-read-only="true" />
      <ModelControl :model="listModel" />
    </Variant>

    <Variant title="Empty Error" :setup-app="loadData">
      <SectionPanelField :field="sectionsSpec" />
      <template #controls>
        <ErrorControl :errors="emptyListError" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { useModelStore, useSharedStore } from '../store';
import SectionPanelField from './section-panel-field.vue';
import ModelControl from '../test/model-control.vue';
import ErrorControl from '../test/error-control.vue';
import { listModel } from '../test/mocks';
import type { StoryHandler } from '../shared/helpers';

const sectionsSpec = {
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

const emptyListError = {
  'bundle.sections': ['The sections field must have at least 1 items'],
};

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  if (variant?.title === 'Empty Error') {
    store.model = { sections: [] };
    shared.errors = emptyListError;
    return;
  }

  store.model = listModel;
  shared.errors = {};
};
</script>
