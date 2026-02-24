<template>
  <Story title="Lang Table" group="settings">
    <Variant title="Default">
      <LangTable :items="languageTableItems" @actions="onActions" />
    </Variant>
    <Variant title="Empty">
      <LangTable :items="[]" />
    </Variant>
    <Variant title="With pagination">
      <LangTable :items="manyLanguageTableItems" :items-per-page="5" @actions="onActions" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LangTable from './language-table.vue';
import {
  languageTableItems,
  manyLanguageTableItems,
} from '../../../test/mocks';
import type { LanguageTableItem } from '../../../../types';

const onActions = (item: LanguageTableItem) => {
  alert(`Actions for ${item.language} (${item.locale})`);
};
</script>
