<template>
  <Story title="Bible Translations Modal" group="settings">
    <Variant title="With translations" :setup-app="setupWithTranslations">
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white"
        @click="showModal = true"
      >
        Choose Bible translation
      </button>
      <BibleTranslationsModal
        :open="showModal"
        :item="englishItem"
        @close="showModal = false"
        @confirm="onConfirm"
      />
    </Variant>
    <Variant title="No translations for language" :setup-app="setupWithTranslations">
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white"
        @click="showEmptyModal = true"
      >
        Choose Bible translation
      </button>
      <BibleTranslationsModal
        :open="showEmptyModal"
        :item="obscureLanguageItem"
        @close="showEmptyModal = false"
        @confirm="onConfirm"
      />
    </Variant>
    <Variant title="Multiple versions" :setup-app="setupWithMultipleVersions">
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white"
        @click="showMultipleModal = true"
      >
        Choose Bible translation
      </button>
      <BibleTranslationsModal
        :open="showMultipleModal"
        :item="spanishItem"
        @close="showMultipleModal = false"
        @confirm="onConfirm"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BibleTranslationsModal from './bible-translations-modal.vue';
import { useSharedStore, useWidgetsStore } from '../../../store';
import type { StoryHandler } from '../../../shared/helpers';
import type { LanguageTableItem } from '../../../../types';

const showModal = ref(false);
const showEmptyModal = ref(false);
const showMultipleModal = ref(false);

const englishItem: LanguageTableItem = {
  language: 'English',
  languageDirection: 'ltr',
  locale: 'en',
  bibleVersion: 'de4e12af7f28f599-01',
  bibleLabel: '(KJV) King James Version',
};

const obscureLanguageItem: LanguageTableItem = {
  language: 'Klingon',
  languageDirection: 'ltr',
  locale: 'tlh',
};

const spanishItem: LanguageTableItem = {
  language: 'Spanish',
  languageDirection: 'ltr',
  locale: 'es',
  bibleVersion: '592420522e16049f-01',
  bibleLabel: '(RVR1960) Reina-Valera 1960',
};

const mockEnglishTranslations = [
  {
    language: 'English',
    bibleVersion: 'de4e12af7f28f599-01',
    bibleLabel: '(KJV) King James Version',
  },
  {
    language: 'English',
    bibleVersion: '9879dbb7cfe39e4d-01',
    bibleLabel: '(ERV) Easy-to-Read Version',
  },
  {
    language: 'English',
    bibleVersion: 'abc123-01',
    bibleLabel: '(ESV) English Standard Version',
  },
];

const mockTranslationsWithMultiple = [
  ...mockEnglishTranslations,
  {
    language: 'Spanish',
    bibleVersion: '592420522e16049f-01',
    bibleLabel: '(RVR1960) Reina-Valera 1960',
  },
  {
    language: 'Spanish',
    bibleVersion: 'spa002-01',
    bibleLabel: '(NTV) Nueva Traducción Viviente',
  },
  { language: 'Spanish', bibleVersion: 'spa003-01', bibleLabel: '(DHH) Dios Habla Hoy' },
];

const setupWithTranslations: StoryHandler = () => {
  const shared = useSharedStore();
  const widgets = useWidgetsStore();
  shared.setBibleTranslations(mockEnglishTranslations);
  widgets.setProviders({
    ...widgets.providers,
    scripture: { bibleApiKey: 'mock-key-for-story' },
  });
};

const setupWithMultipleVersions: StoryHandler = () => {
  const shared = useSharedStore();
  const widgets = useWidgetsStore();
  shared.setBibleTranslations(mockTranslationsWithMultiple);
  widgets.setProviders({
    ...widgets.providers,
    scripture: { bibleApiKey: 'mock-key-for-story' },
  });
};

const onConfirm = (bibleVersion: string, bibleVersionName: string) => {
  alert(`Confirmed: ${bibleVersionName} (${bibleVersion})`);
};
</script>
