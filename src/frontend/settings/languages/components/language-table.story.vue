<template>
  <Story title="Language Table" group="settings">
    <Variant title="Default">
      <LangTable
        :items="languageTableItems"
        :source-language="sourceLanguage"
        @remove="onRemove"
        @request-deletion="onRequestDeletion"
      />
    </Variant>
    <Variant title="Empty">
      <LangTable :items="[]" :source-language="sourceLanguage" />
    </Variant>
    <Variant title="With pagination">
      <LangTable
        :items="manyLanguageTableItems"
        :source-language="sourceLanguage"
        :items-per-page="5"
        @remove="onRemove"
        @request-deletion="onRequestDeletion"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LangTable from './language-table.vue';
import {
  languageTableItems,
  manyLanguageTableItems,
  sourceLanguage,
} from '../../../test/mocks';
import type { LanguageTableItem } from '../../../../types';

const onRemove = (item: LanguageTableItem) => {
  alert(`Remove: ${item.language} (${item.locale})`);
};

const onRequestDeletion = (item: LanguageTableItem) => {
  alert(`Request deletion: ${item.language} (${item.locale})`);
};
</script>
