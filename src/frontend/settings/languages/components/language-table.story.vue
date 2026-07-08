<template>
  <Story title="Language Table" group="settings">
    <Variant title="Default">
      <div>
        <div class="pb-4">
          <h3 class="text-xl/7 font-semibold text-gray-800">Languages</h3>
          <p class="text-sm text-gray-500">
            Here you can manage your languages. Press the blue + to add a new language.
          </p>
        </div>
        <LangTable
          :items="languageTableItems"
          :source-language="sourceLanguage"
          @remove="onRemove"
          @request-deletion="onRequestDeletion"
        />
      </div>
    </Variant>
    <Variant title="Empty">
      <div>
        <div class="pb-4">
          <h3 class="text-xl/7 font-semibold text-gray-800">Languages</h3>
          <p class="text-sm text-gray-500">
            Here you can manage your languages. Press the blue + to add a new language.
          </p>
        </div>
        <LangTable :items="[]" :source-language="sourceLanguage" />
      </div>
    </Variant>
    <Variant title="With pagination">
      <div>
        <div class="pb-4">
          <h3 class="text-xl/7 font-semibold text-gray-800">Languages</h3>
          <p class="text-sm text-gray-500">
            Here you can manage your languages. Press the blue + to add a new language.
          </p>
        </div>
        <LangTable
          :items="manyLanguageTableItems"
          :source-language="sourceLanguage"
          :items-per-page="5"
          @remove="onRemove"
          @request-deletion="onRequestDeletion"
        />
      </div>
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
