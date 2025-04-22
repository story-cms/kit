<template>
  <Story title="Ui Index Page" group="interface">
    <Variant title="Index">
      <UiIndex
        :errors="sharedProps.errors"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :stories="['John', 'Acts']"
        :ui-progress="sharedProps.uiProgress"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import UiIndex from './ui-index.vue';
import { sharedProps } from '../test/mocks';

const progress = [
  {
    locale: 'en',
    language: 'spanish',
    translatedCount: 5,
    updatedAt: '2022-01-01',
    totalCount: 10,
  },
];
</script>
