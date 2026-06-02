<template>
  <Story title="Languages Edit" group="settings">
    <Variant title="Edit" :setup-app="miniSidebar">
      <LanguagesEdit
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
        :source-language="sourceLanguage"
        :language-items="[]"
        :added-languages="languages"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LanguagesEdit from './languages-edit.vue';
import { miniSidebar, sharedProps, sourceLanguage } from '../../test/mocks';
import type { LanguageSpecification } from '../../../types';

const languages: LanguageSpecification[] = [
  {
    locale: 'en',
    language: 'English',
    languageDirection: 'ltr',
  },
  {
    locale: 'es',
    language: 'Spanish',
    languageDirection: 'ltr',
  },
  {
    locale: 'fr',
    language: 'French',
    languageDirection: 'ltr',
  },
  {
    locale: 'de',
    language: 'German',
    languageDirection: 'ltr',
  },
];
</script>
