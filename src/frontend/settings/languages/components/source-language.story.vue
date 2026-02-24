<template>
  <Story title="Source Language" group="settings">
    <Variant title="Default">
      <div class="rounded-lg bg-white p-4 shadow-md">
        <SourceLang :spec="sourceLang" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import SourceLang from './source-language.vue';
import type { LanguageSpecification } from '../../../../types';

const sourceLang: LanguageSpecification = {
  language: 'English',
  locale: 'en',
  languageDirection: 'ltr',
  bibleVersionId: 'de4e12af7f28f599-01',
  bibleLabel: '(KJV) King James Version',
};
</script>
