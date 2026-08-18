<template>
  <Story title="Language option label" group="shared" :layout="{ type: 'grid', width: 280 }">
    <Variant title="English">
      <div class="rounded-xl border border-gray-200 bg-white p-3">
        <LanguageOptionLabel :spec="english" />
      </div>
    </Variant>

    <Variant title="Spanish">
      <div class="rounded-xl border border-gray-200 bg-white p-3">
        <LanguageOptionLabel :spec="spanish" />
      </div>
    </Variant>

    <Variant title="Chinese (Simplified)">
      <div class="rounded-xl border border-gray-200 bg-white p-3">
        <LanguageOptionLabel :spec="chineseSimplified" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LanguageOptionLabel from './language-option-label.vue';
import type { LanguageSpecification } from '../../types';

const english: LanguageSpecification = {
  language: 'English',
  locale: 'en',
  languageDirection: 'ltr',
};

const spanish: LanguageSpecification = {
  language: 'Spanish | Español',
  locale: 'es',
  languageDirection: 'ltr',
};

const chineseSimplified: LanguageSpecification = {
  language: 'Chinese (Simplified) | 简体中文',
  locale: 'zh-Hans',
  languageDirection: 'ltr',
};
</script>
