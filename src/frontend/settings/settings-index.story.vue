<template>
  <Story title="Settings Index" group="settings">
    <Variant title="Index" :setup-app="miniSidebar">
      <SettingsIndex
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
        :source-language="sourceLanguage"
        :language-items="languageTableItems"
      />
    </Variant>
    <Variant title="Empty" :setup-app="miniSidebar">
      <SettingsIndex
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
        :source-language="sourceLanguage"
        :language-items="[]"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import SettingsIndex from './settings-index.vue';
import {
  sharedProps,
  miniSidebar,
  sourceLanguage,
  languageTableItems,
} from '../test/mocks';
</script>
