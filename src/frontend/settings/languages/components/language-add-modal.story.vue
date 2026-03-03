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

const languages: LanguageSpecification[] = [
  { locale: 'fr', language: 'French', languageDirection: 'ltr' },
  { locale: 'de', language: 'German', languageDirection: 'ltr' },
];

const multipleLanguages: LanguageSpecification[] = [
  { locale: 'fr', language: 'French', languageDirection: 'ltr' },
  { locale: 'de', language: 'German', languageDirection: 'ltr' },
  { locale: 'es', language: 'Spanish', languageDirection: 'ltr' },
  { locale: 'it', language: 'Italian', languageDirection: 'ltr' },
  { locale: 'pt', language: 'Portuguese', languageDirection: 'ltr' },
  { locale: 'ru', language: 'Russian', languageDirection: 'ltr' },
  { locale: 'sv', language: 'Swedish', languageDirection: 'ltr' },
  { locale: 'tr', language: 'Turkish', languageDirection: 'ltr' },
  { locale: 'uk', language: 'Ukrainian', languageDirection: 'ltr' },
  { locale: 'zh', language: 'Chinese', languageDirection: 'ltr' },
  { locale: 'zu', language: 'Zulu', languageDirection: 'ltr' },
  { locale: 'af', language: 'Afrikaans', languageDirection: 'ltr' },
  { locale: 'am', language: 'Amharic', languageDirection: 'ltr' },
  { locale: 'ar', language: 'Arabic', languageDirection: 'rtl' },
  { locale: 'as', language: 'Assamese', languageDirection: 'ltr' },
  { locale: 'az', language: 'Azerbaijani', languageDirection: 'ltr' },
  { locale: 'be', language: 'Belarusian', languageDirection: 'ltr' },
  { locale: 'bg', language: 'Bulgarian', languageDirection: 'ltr' },
];
</script>
