<template>
  <Story title="Boolean Field" group="widgets">
    <Variant title="With model" :setup-app="loadData">
      <BooleanField :field="spec" />
      <ModelControl :model="objectModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Without start value" :setup-app="loadEmptyData">
      <BooleanField :field="spec" />
      <ModelControl :model="objectModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Special tint" :setup-app="loadData">
      <BooleanField :field="{ ...spec, tintColor: 'green-400' }" />
      <ModelControl :model="objectModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Label start" :setup-app="loadData">
      <BooleanField :field="{ ...spec, labelOrder: 'start' }" />
      <ModelControl :model="objectModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <BooleanField :field="spec" />
      <template #controls>
        <ErrorControl :errors="objectErrors" />
      </template>
    </Variant>

    <Variant title="RTL">
      <BooleanField :dir="isRtl ? 'rtl' : 'ltr'" :field="spec" />
      <LanguageControl />
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <BooleanField
        :field="{
          name: 'isFavourite',
          label: 'Is Favourite',
          widget: 'boolean',
          default: true,
        }"
        :is-read-only="true"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BooleanField from './boolean-field.vue';
import LanguageControl from '../test/language-control.vue';
import ErrorControl from '../test/error-control.vue';
import ModelControl from '../test/model-control.vue';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const isRtl = computed(() => {
  return useSharedStore().isRtl;
});

const objectModel = {
  isFavourite: true,
};

const objectErrors = {
  'bundle.isFavourite': ['required validation failed'],
};

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  store.model = objectModel;
  if (variant?.title === 'Error') {
    shared.errors = objectErrors;
  }
  if (variant?.title === 'Readonly') {
    store.setSource({
      isFavourite: false,
    });
  }
};

const loadEmptyData: StoryHandler = () => {
  const store = useModelStore();
  store.model = { name: 'Isaac Newton' };
};

const spec = {
  name: 'isFavourite',
  label: 'Is Favourite',
  widget: 'boolean',
  default: false,
};
</script>

<docs lang="md">
# Boolean Field
</docs>
