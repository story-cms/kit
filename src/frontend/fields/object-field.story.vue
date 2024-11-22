<template>
  <Story title="ObjectField" group="widgets">
    <Variant title="Default" :setup-app="loadData">
      <ObjectField :field="objectSpec" />
      <ModelControl :model="objectModel" />
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <ObjectField :field="objectSpec" :is-read-only="true" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <ObjectField :field="objectSpec" />
      <template #controls>
        <ErrorControl :errors="objectErrors" />
      </template>
    </Variant>

    <Variant title="List in Object" :setup-app="loadData">
      <ObjectField :field="listInObjectSpec" />
      <ModelControl :model="listInObjectModel" />
    </Variant>

    <Variant title="List in Object Empty">
      <ObjectField :field="listInObjectSpec" />
      <ModelControl :model="listInObjectModel" />
    </Variant>

    <Variant title="List in Object Error" :setup-app="loadData">
      <ObjectField :field="listInObjectSpec" />
      <template #controls>
        <ErrorControl :errors="listInObjectError" />
      </template>
    </Variant>

    <Variant title="Object in List in Object" :setup-app="loadData">
      <ObjectField :field="objectInListInObjectSpec" />
      <ModelControl :model="objectInListInObjectModel" />
    </Variant>

    <Variant title="Object in List in Object Empty">
      <ObjectField :field="objectInListInObjectSpec" />
      <ModelControl :model="objectInListInObjectModel" />
    </Variant>

    <Variant title="Object in List in Object Error" :setup-app="loadData">
      <ObjectField :field="objectInListInObjectSpec" />
      <template #controls>
        <ErrorControl :errors="objectInListInObjectErrors" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { useModelStore, useSharedStore } from '../store';
import ObjectField from './object-field.vue';
import ErrorControl from './helpers/error-control.vue';
import ModelControl from './helpers/model-control.vue';
import {
  objectErrors,
  objectModel,
  objectModelReadonly,
  objectSpec,
  listInObjectSpec,
  listInObjectModel,
  listInObjectError,
  objectInListInObjectSpec,
  objectInListInObjectModel,
  objectInListInObjectErrors,
} from '../../frontend/test/mocks';

import type { StoryHandler } from '../shared/helpers';

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  switch (variant?.title) {
    case 'Error':
      shared.errors = objectErrors;
      break;
    case 'Readonly':
      store.setSource({
        ...objectModelReadonly,
      });
      break;
    case 'Default':
      store.model = objectModel;
      break;

    case 'List in Object Error':
      shared.errors = listInObjectError;
      break;
    case 'List in Object':
      store.model = listInObjectModel;
      break;

    case 'Object in List in Object Error':
      shared.errors = objectInListInObjectErrors;
      break;
    case 'Object in List in Object':
      store.model = objectInListInObjectModel;
      break;

    default:
      break;
  }
};
</script>
