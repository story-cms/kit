<template>
  <Story title="PanelField" group="widgets">
    <Variant title="Default" :setup-app="loadData">
      <PanelField :field="spec" />
      <ModelControl :model="panelModel" />
    </Variant>

    <Variant title="Rows" :setup-app="loadData">
      <PanelField :field="isRowWithNoLabel" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <PanelField :field="spec" />
      <template #controls>
        <ErrorControl :errors="panelErrors" />
      </template>
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <PanelField :field="spec" :is-read-only="true" />
      <ModelControl :model="panelModel" />
    </Variant>

    <Variant title="No Label" :setup-app="loadData">
      <PanelField :field="noLabel" />
      <ModelControl :model="panelModel" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PanelField from './panel-field.vue';
import ModelControl from '../test/model-control.vue';
import ErrorControl from '../test/error-control.vue';
import { useModelStore, useSharedStore } from '../store';

import type { StoryHandler } from '../shared/helpers';

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  store.model = panelModel;
  if (variant?.title === 'Error') {
    shared.errors = panelErrors;
  }
  if (variant?.title === 'Readonly') {
    store.setSource({
      title: 'English Title',
      description: '# English Description',
    });
  }
};

const spec = {
  label: 'Note',
  name: 'note',
  widget: 'panel',
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
    },
  ],
};

const noLabel = {
  label: '',
  name: 'note',
  widget: 'panel',
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
    },
  ],
};

const isRowWithNoLabel = {
  label: '',
  name: 'note',
  widget: 'panel',
  isRow: true,
  fields: [
    {
      name: 'profile',
      label: 'Profile Image',
      widget: 'image',
    },
    {
      name: 'avatar',
      label: 'Avatar Image',
      widget: 'image',
    },
  ],
};

const panelModel = {
  title: 'John',
  description: '# Read about John',
};

const panelErrors = {
  'bundle.title': ['required validation failed'],
};
</script>
