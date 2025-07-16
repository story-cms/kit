<template>
  <Story title="Date Field" group="widgets">
    <Variant title="With time picker">
      <DateField :enable-time-picker="true" />
    </Variant>
    <Variant title="Without time picker">
      <DateField :enable-time-picker="false" />
    </Variant>
    <Variant title="With error" :setup-app="loadData">
      <DateField
        :enable-time-picker="false"
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
        :enable-time-picker="false"
        :is-read-only="true"
        :field="{
          name: 'releasedAt',
          label: 'Released At',
          widget: 'date',
        }"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ErrorControl from '../test/error-control.vue';

import { objectErrors, objectModel } from '../../frontend/test/mocks';
import DateField from './date-field.vue';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

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
