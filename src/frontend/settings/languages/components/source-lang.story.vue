<template>
  <Story title="Source Language" group="settings">
    <Variant title="Default">
      <SourceLang
        :language="sourceLang.language"
        :locale="sourceLang.locale"
        :language-direction="'ltr'"
        :bible-version-name="sourceLang.bibleVersionName"
        :bible-version-abbreviation="sourceLang.bibleVersionAbbreviation"
        :bible-version-id="sourceLang.bibleVersionId"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import SourceLang from './source-lang.vue';

const sourceLang = {
  language: 'English',
  locale: 'en',

  bibleVersionName: 'King James Version',
  bibleVersionAbbreviation: 'KJV',
  bibleVersionId: 'de4e12af7f28f599-01',
};
</script>
