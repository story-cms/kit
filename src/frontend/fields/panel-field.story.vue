<template>
  <Story title="Panel Field" group="widgets">
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
    <Variant title="Error Nested" :setup-app="loadData">
      <PanelField :field="nestedSpec" />
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
  if (variant?.title === 'Error' || variant?.title === 'Error Nested') {
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
    {
      label: 'Expiry Date',
      name: 'expiryDate',
      widget: 'date',
    },
  ],
};

const noLabel = {
  ...spec,
  label: '',
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

const nestedSpec = {
  label: '',
  name: 'notes',
  widget: 'panel',
  fields: [
    {
      label: 'Segments',
      name: 'segments',
      widget: 'list',
      canFold: true,
      fields: [
        { label: 'Segment Title', name: 'title', widget: 'string' },
        { label: 'Video URL', name: 'videoUrl', widget: 'string' },
        {
          label: 'Sections',
          name: 'sections',
          widget: 'list',
          fields: [
            { label: 'Title', name: 'title', widget: 'string' },
            { label: 'Reference', name: 'reference', widget: 'string' },
            { label: 'Reference Text', name: 'referenceText', widget: 'markdown' },

            { label: 'Notes', name: 'notes', widget: 'markdown' },
            { label: 'Note Question', name: 'noteQuestion', widget: 'markdown' },

            { label: 'Question Intro', name: 'questionIntro', widget: 'markdown' },
            { label: 'Question One', name: 'openQuestion', widget: 'markdown' },
            { label: 'Question Two', name: 'closedQuestion', widget: 'markdown' },
          ],
        },
      ],
    },
  ],
};

const panelModel = {
  title: 'John',
  description: '# Read about John',
  expiryDate: '2025-07-04T12:00:00.000Z',
};

const panelErrors = {
  'bundle.title': ['all notes are required'],
  'bundle.segments': ['required validation failed'],
};
</script>
