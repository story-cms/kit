<template>
  <Story title="Settings Index" group="settings">
    <Variant title="Index" :setup-app="setupSettings">
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
        :providers="settingsProviders"
      />
    </Variant>
    <Variant title="Empty" :setup-app="setupSettings">
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
        :providers="settingsProviders"
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
import { useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';
import type { Providers } from '../../types';

const settingsProviders: Providers = {
  s3: {
    accessKeyId: '',
    accessKey: '',
    bucket: '',
    region: '',
    endpoint: '',
    folder: '',
  },
  cloudinary: {
    apiKey: '',
    secret: '',
    cloudName: '',
    defaultPreset: '',
  },
  scripture: { bibleApiKey: '' },
  bunny: {
    accessKey: '',
    libraryId: '',
    host: '',
  },
};

const mockBibleTranslations = [
  { language: 'English', bibleVersion: 'de4e12af7f28f599-01', bibleLabel: '(KJV) King James Version' },
  { language: 'English', bibleVersion: '9879dbb7cfe39e4d-01', bibleLabel: '(ERV) Easy-to-Read Version' },
  { language: 'Spanish', bibleVersion: '592420522e16049f-01', bibleLabel: '(RVR1960) Reina-Valera 1960 Spanish Translation (2023) (Revised)' },
  { language: 'Spanish', bibleVersion: 'spa002-01', bibleLabel: '(NTV) Nueva Traducción Viviente' },
  { language: 'French', bibleVersion: 'frlsg-01', bibleLabel: 'Louis Segond' },
  { language: 'German', bibleVersion: 'de-lut-01', bibleLabel: 'Luther Bibel' },
  { language: 'Swahili', bibleVersion: 'swah-01', bibleLabel: 'Biblia Habari Njema' },
];

const setupSettings: StoryHandler = ({ app, story, variant }) => {
  miniSidebar({ app, story, variant });
  const shared = useSharedStore();
  shared.setBibleTranslations(mockBibleTranslations);
};
</script>
