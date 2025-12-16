<template>
  <Story title="Date Range Field" group="widgets">
    <Variant title="Empty" :setup-app="loadData">
      <DateRangeField :field="modelSpec" />
      <ModelControl :model="emptyModel" />
    </Variant>

    <Variant title="Default" :setup-app="loadData">
      <DateRangeField :field="modelSpec" />
      <ModelControl :model="objectModel" />
    </Variant>

    <Variant title="With error" :setup-app="loadData">
      <DateRangeField :field="modelSpec" />
      <template #controls>
        <ErrorControl :errors="objectErrors" />
      </template>
    </Variant>

    <Variant title="Read only" :setup-app="loadData">
      <DateRangeField :is-read-only="true" :field="modelSpec" />
      <ModelControl :model="readonlyModel" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ErrorControl from '../test/error-control.vue';

import DateRangeField from './date-range-field.vue';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';
import ModelControl from '../test/model-control.vue';

const objectModel = {
  name: 'March Giving',
  description: 'March Giving is a campaign to raise money for the charity.',
  type: 'giving',
  window: '2027-01-08T07:30:00.000Z|2027-01-15T07:30:00.000Z',
};

const readonlyModel = {
  ...objectModel,
  window: '2025-07-08T07:30:00.000Z|2025-07-15T07:30:00.000Z',
};

const emptyModel = {
  ...objectModel,
  window: '',
};

const modelSpec = {
  name: 'window',
  label: 'Campaign window',
  widget: 'dateRange',
};

const objectErrors = {
  'bundle.name': ['required validation failed'],
  'bundle.notes': ['required validation failed'],
  'bundle.profile': ['required validation failed'],
  'bundle.address.zip': ['required validation failed'],
  'bundle.address.favoriteScripture': ['required validation failed'],
  'bundle.window': ['You must select a start and end date'],
  'bundle.tags': ['required validation failed'],
};

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();
  store.model = objectModel;

  if (variant?.title === 'Empty') {
    store.model = emptyModel;
  }

  if (variant?.title === 'With error') {
    shared.errors = objectErrors;
  }

  if (variant?.title === 'Read only') {
    store.setSource(readonlyModel);
    store.model = readonlyModel;
  }
};
</script>

<docs lang="md">
# Date Range Field

A date range picker that renders a DateRangeField. It has has no special properties.
The two dates are stored in the model with the current as UTC time.

example:

```ts
{
  label: 'Campaign window',
  name: 'window',
  widget: 'dateRange',
},
```
</docs>
