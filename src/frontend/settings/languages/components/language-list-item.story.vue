<template>
  <Story
    title="Language List Item"
    group="settings"
    :layout="{ type: 'grid', width: 350 }"
  >
    <Variant title="Default">
      <LanguageListItem
        :language="{
          language: 'English',
          locale: 'en',
          languageDirection: 'ltr',
          bibleVersionId: 'de4e12af7f28f599-01',
          bibleLabel: '(KJV) King James Version',
        }"
        status="available"
      />
    </Variant>
    <Variant title="Selected">
      <LanguageListItem
        :language="{
          language: 'Amharic - አማርኛ',
          locale: 'am',
          languageDirection: 'ltr',
          bibleVersionId: 'de4e12af7f28f599-01',
        }"
        status="selected"
      />
    </Variant>
    <Variant title="Long Language">
      <LanguageListItem
        :language="{
          language: 'Swiss German Alemannic Alsatian - Alemannisch',
          locale: 'gsw',
          languageDirection: 'ltr',
          bibleVersionId: 'de4e12af7f28f599-01',
        }"
        status="selected"
      />
    </Variant>
    <Variant title="Added">
      <LanguageListItem
        :language="{
          language: 'Arabic - العربية',
          locale: 'ar',
          languageDirection: 'rtl',
          bibleVersionId: 'de4e12af7f28f599-01',
        }"
        status="readonly"
      />
    </Variant>
    <Variant title="Interactive">
      <LanguageListItem
        :language="{
          language: 'English',
          locale: 'en',
          languageDirection: 'ltr',
          bibleVersionId: 'de4e12af7f28f599-01',
          bibleLabel: '(KJV) King James Version',
        }"
        status="available"
        @update="isSelected = $event"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LanguageListItem from './language-list-item.vue';

const isSelected = ref(false);
</script>
