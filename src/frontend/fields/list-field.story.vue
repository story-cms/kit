<template>
  <Story title="ListField" group="widgets">
    <Variant title="Default" :setup-app="loadData">
      <ListField :field="listSpec" />
      <ModelControl :model="listModel" />
    </Variant>

    <Variant title="Foldable" :setup-app="loadData">
      <ListField :field="{ canFold: true, ...listSpec }" />
      <ModelControl :model="listModel" />
    </Variant>

    <Variant title="Load data">
      <ListField :field="{ canFold: true, ...listSpec }" />
      <ModelControl :model="listModel" :is-inspect-only="false" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <ListField :field="{ canFold: true, ...listSpec }" />
      <template #controls>
        <ErrorControl :errors="listErrors" />
      </template>
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <ListField :field="pokeSpec" :is-read-only="true" />
    </Variant>

    <Variant title="Readonly foldable" :setup-app="loadData">
      <ListField :field="foldableSpec" :is-read-only="true" />
    </Variant>

    <Variant title="List in List" :setup-app="loadData">
      <ListField :field="listInListSpec" />
      <ModelControl :model="listInListModel" />
    </Variant>

    <Variant title="List in List Empty">
      <ListField :field="listInListSpec" />
      <ModelControl :model="listInListModel" :is-inspect-only="false" />
    </Variant>

    <Variant title="List in List Error" :setup-app="loadData">
      <ListField :field="listInListSpec" />
      <template #controls>
        <ErrorControl :errors="listInListErrors" />
      </template>
    </Variant>

    <Variant title="Poke" :setup-app="loadData">
      <ListField :field="pokeSpec" />
      <ModelControl :model="pokeModel" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { useModelStore, useSharedStore } from '../store';

import ListField from './list-field.vue';
import ModelControl from './helpers/model-control.vue';
import ErrorControl from './helpers/error-control.vue';
import {
  listSpec,
  listModel,
  listErrors,
  listInListModel,
  listInListSpec,
  listInListErrors,
} from '../../frontend/test/mocks';

import type { StoryHandler } from '../shared/helpers';

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  if (variant?.title === 'Error') {
    shared.errors = listErrors;
    store.model = listModel;
    return;
  }
  if (variant?.title === 'List in List Error') {
    shared.errors = listInListErrors;
    return;
  }
  if (variant?.title === 'List in List') {
    store.model = listInListModel;
    return;
  }
  if (variant?.title === 'Poke') {
    store.model = pokeModel;
    return;
  }
  if (variant?.title === 'Readonly') {
    store.setSource({
      ...listModel,
      conclusions: [
        {
          statement: 'This is a summary statement',
          excerpt: 'This is a scripture excerpt',
        },
        {
          statement: 'This is another summary statement',
          excerpt: 'This is another scripture excerpt',
        },
      ],
    });
    return;
  }
  if (variant?.title === 'Readonly foldable') {
    store.setSource({
      ...pokeModel,
      conclusions: [
        {
          statement: 'This is a summary statement',
          excerpt: 'This is a scripture excerpt',
        },
        {
          statement: 'This is another summary statement',
          excerpt: 'This is another scripture excerpt',
        },
      ],
    });
    return;
  }
  store.model = listModel;
};

const pokeSpec = {
  label: 'Summary Statement',
  name: 'conclusions',
  widget: 'list',
  index: 'statement',
  fields: [
    {
      label: 'Summary Statement',
      name: 'statement',
      widget: 'string',
    },
    {
      label: 'Scripture Excerpt',
      name: 'excerpt',
      widget: 'markdown',
      minimal: true,
      buttons: ['code'],
    },
  ],
};

const foldableSpec = { ...pokeSpec, canFold: true };

const pokeModel = {
  conclusions: [
    {
      statement: 'This is a summary statement',
      excerpt: 'This is a scripture excerpt',
    },
    {
      statement: 'This is another summary statement',
      excerpt: 'This is another scripture excerpt',
    },
  ],
};
</script>
