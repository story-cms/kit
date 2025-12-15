<template>
  <Story title="Region Field" group="widgets">
    <Variant title="Default">
      <RegionField :field="spec" />
      <ModelControl :model="objectModel" :is-inspect-only="true" />
    </Variant>
    <Variant title="With model" :setup-app="loadData">
      <RegionField :field="spec" />
      <ModelControl :model="objectModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <RegionField :field="spec" />
      <template #controls>
        <ErrorControl :errors="objectErrors" />
      </template>
    </Variant>

    <Variant title="RTL" :setup-app="loadData">
      <RegionField :dir="isRtl ? 'rtl' : 'ltr'" :field="spec" />
      <LanguageControl />
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <RegionField :field="spec" :is-read-only="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import RegionField from './region-field.vue';
import LanguageControl from '../test/language-control.vue';
import ErrorControl from '../test/error-control.vue';
import ModelControl from '../test/model-control.vue';
import { objectErrors, objectModel } from '../test/mocks';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const isRtl = computed(() => {
  return useSharedStore().isRtl;
});

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  store.model = {
    name: 'John Kiptum',
    regions: 'CX, KE, UG, ZM',
  };
  if (variant?.title === 'Error') {
    shared.errors = objectErrors;
  }
  if (variant?.title === 'Readonly') {
    store.setSource({
      regions: 'KE,CX,ZM,US,ZA',
    });
  }
};

const spec = {
  name: 'regions',
  label: 'Regions',
  widget: 'regions',
};
</script>

<docs lang="md">
# String Field
</docs>
