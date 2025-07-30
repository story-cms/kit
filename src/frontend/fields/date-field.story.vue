<template>
  <Story title="Date Field" group="widgets">
    <Variant title="Default" :setup-app="loadData">
      <DateField
        :field="{
          name: 'releasedAt',
          label: 'Released At',
          widget: 'date',
        }"
      />
      <ModelControl :model="objectModel" />
    </Variant>
    <Variant title="With time picker" :setup-app="loadData">
      <DateField
        :field="{
          name: 'releasedAt',
          label: 'Released At',
          widget: 'date',
          hasTimePicker: true,
        }"
      />
      <ModelControl :model="objectModel" />
    </Variant>

    <Variant title="With error" :setup-app="loadData">
      <DateField
        :field="{
          name: 'releasedAt',
          label: 'Released At',
          widget: 'date',
        }"
      />
      <template #controls>
        <ErrorControl :errors="objectErrors" />
      </template>
    </Variant>
    <Variant title="Read only" :setup-app="loadData">
      <DateField
        :is-read-only="true"
        :field="{
          name: 'releasedAt',
          label: 'Released At',
          widget: 'date',
          hasTimePicker: true,
        }"
      />
      <ModelControl :model="readonlyModel" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ErrorControl from '../test/error-control.vue';

import { objectErrors } from '../../frontend/test/mocks';
import DateField from './date-field.vue';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';
import ModelControl from '../test/model-control.vue';

const objectModel = {
  name: 'John',
  age: 30,
  releasedAt: '2027-01-08T07:30:00.000Z',
  passport: {
    number: '1234567890',
    country: 'United States',
    expiryDate: '2025-07-08T07:30:00.000Z',
  },
};

const readonlyModel = {
  ...objectModel,
  releasedAt: '2027-04-01T07:30:00.000Z',
};

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();
  store.model = objectModel;

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
# Date Field

A date picker that renders a DateField. It has one optional key called
`hasTimePicker` which is a boolean that specifies whether the date picker should show a
time picker.

There is no time-zone configuration currently. The time that is picked is the browser's local time and then stored in the model as UTC.

example:

```ts
{
  label: 'Released At',
  name: 'releasedAt',
  widget: 'date',
},
```

DateField with time picker

```ts
{
  label: 'Released At',
  name: 'releasedAt',
  widget: 'date',
  hasTimePicker: true,
},
```
</docs>
