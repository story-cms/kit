<template>
  <Story title="Language Add Modal" group="settings">
    <Variant title="Open">
      <LanguageAddModal
        :open="true"
        :languages="languages"
        @close="() => {}"
        @back="() => {}"
        @add="() => {}"
      />
    </Variant>
    <Variant title="Multiple languages">
      <LanguageAddModal
        :open="true"
        :languages="multipleLanguages"
        @close="() => {}"
        @back="() => {}"
        @add="() => {}"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LanguageAddModal from './language-add-modal.vue';
import type { LanguageSpecification } from '../../../../types';
import { languages as languagesArray } from '../languages';

const languages: LanguageSpecification[] = [
  { locale: 'fr', language: 'French', languageDirection: 'ltr' },
  { locale: 'de', language: 'German', languageDirection: 'ltr' },
];

const multipleLanguages: LanguageSpecification[] = languagesArray
  .sort(() => Math.random() - 0.5)
  .slice(0, 20);
</script>
