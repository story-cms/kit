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
        :is-selected="false"
        :is-added="false"
      />
    </Variant>
    <Variant title="Selected">
      <LanguageListItem
        :language="{
          language: 'Amharic - አማርኛ',
          locale: 'am',
          languageDirection: 'ltr',
          bibleVersionId: 'de4e12af7f28f599-01',

        }" :is-selected="true" :is-added="false" />
    </Variant>
    <Variant title="Added">
      <LanguageListItem
        :language="{
          language: 'Arabic - العربية',
          locale: 'ar',
          languageDirection: 'rtl',
          bibleVersionId: 'de4e12af7f28f599-01',

        }" :is-selected="false" 
        :is-added="true"
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
        :is-selected="isSelected"
        :is-added="false"
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
