<template>
  <Story title="Number Field" group="widgets">
    <Variant title="With model" :setup-app="loadData">
      <NumberField :field="spec" />
      <ModelControl :model="objectModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Empty">
      <NumberField :field="spec" />
      <ModelControl :model="objectModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="With default">
      <NumberField :field="{ ...spec, default: 2 }" />
      <ModelControl :model="objectModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <NumberField :field="spec" />
      <template #controls>
        <ErrorControl :errors="objectErrors" />
      </template>
    </Variant>

    <Variant title="RTL">
      <NumberField :dir="isRtl ? 'rtl' : 'ltr'" :field="spec" />
      <LanguageControl />
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <NumberField :field="spec" :is-read-only="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import NumberField from './number-field.vue';
import LanguageControl from './helpers/language-control.vue';
import ErrorControl from './helpers/error-control.vue';
import ModelControl from './helpers/model-control.vue';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const isRtl = computed(() => {
  return useSharedStore().isRtl;
});

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  store.model = objectModel;
  if (variant?.title === 'Error') {
    shared.errors = objectErrors;
  }
  if (variant?.title === 'Readonly') {
    store.setSource({
      ...objectModel,
      age: 50,
    });
  }
};

const spec = {
  name: 'age',
  label: 'Age',
  widget: 'number',
};

const objectModel = {
  name: 'John',
  age: 20,
};

const objectErrors = {
  'bundle.age': ['required validation failed'],
};
</script>

<docs lang="md">
# Number Field
</docs>
