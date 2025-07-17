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
          enableTimePicker: true,
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
    <Variant title="Read only">
      <DateField
        :is-read-only="true"
        :field="{
          name: 'releasedAt',
          label: 'Released At',
          widget: 'date',
          enableTimePicker: true,
        }"
      />
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

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  if (variant?.title === 'With error') {
    shared.errors = objectErrors;
    return;
  }
  store.model = objectModel;
};
</script>
