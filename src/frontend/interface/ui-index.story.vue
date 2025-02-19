<template>
  <Story title="Ui Index Page" group="interface">
    <Variant title="Index">
      <UiIndex
        :progress="progress"
        :errors="sharedProps.errors"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :stories="['John', 'Acts']"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import UiIndex from './ui-index.vue';
import { sharedProps } from '../test/mocks';

const progress = [
  {
    locale: 'en',
    language: 'English',
    humanTranslation: 345,
    aiTranslation: 0,
    totalCount: 345,
    updatedAt: '2024-03-08T15:03:26.731+00:00',
  },
  {
    locale: 'ar',
    language: 'Arabic: عربى',
    humanTranslation: 5,
    aiTranslation: 200,
    totalCount: 345,
    updatedAt: '2025-01-15T14:55:56.294+00:00',
  },
  {
    locale: 'id',
    language: 'Bahasa Indonesia',
    humanTranslation: 4,
    aiTranslation: 300,
    totalCount: 345,
    updatedAt: '2024-03-13T10:17:05.581+00:00',
  },
  {
    locale: 'zh',
    language: 'Chinese: 中文',
    humanTranslation: 5,
    aiTranslation: 100,
    totalCount: 345,
    updatedAt: '2024-03-13T10:17:38.145+00:00',
  },
  {
    locale: 'fr',
    language: 'French: Français',
    humanTranslation: 250,
    aiTranslation: 86,
    totalCount: 345,
    updatedAt: '2024-03-13T10:17:57.191+00:00',
  },
  {
    locale: 'de',
    language: 'German: Deutsch',
    humanTranslation: 17,
    aiTranslation: 0,
    totalCount: 345,
    updatedAt: '2025-01-14T11:28:42.392+00:00',
  },
  {
    locale: 'hi',
    language: 'Hindi: हिंदी',
    humanTranslation: 1,
    aiTranslation: 0,
    totalCount: 345,
    updatedAt: '2024-03-13T10:24:16.682+00:00',
  },
  {
    locale: 'it',
    language: 'Italian: Italiano',
    humanTranslation: 1,
    aiTranslation: 0,
    totalCount: 345,
    updatedAt: '2024-03-13T10:24:27.975+00:00',
  },
  {
    locale: 'es',
    language: 'Spanish: Español',
    humanTranslation: 1,
    aiTranslation: 0,
    totalCount: 345,
    updatedAt: '2024-03-13T10:25:17.216+00:00',
  },
  {
    locale: 'th',
    language: 'Thai: ภาษาไทย',
    humanTranslation: 1,
    aiTranslation: 0,
    totalCount: 345,
    updatedAt: '2024-03-13T10:24:48.815+00:00',
  },
  {
    locale: 'vi',
    language: 'Vietnamese: Tiếng Việt',
    humanTranslation: 0,
    aiTranslation: 345,
    totalCount: 345,
    updatedAt: '2024-03-13T10:25:56.814+00:00',
  },
];
</script>
