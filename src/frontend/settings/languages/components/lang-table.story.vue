<template>
  <Story title="Lang Table" group="settings">
    <Variant title="Default">
      <LangTable :items="languages" @actions="onActions" />
    </Variant>
    <Variant title="Empty">
      <LangTable :items="[]" />
    </Variant>
    <Variant title="With pagination">
      <LangTable :items="manyLanguages" :items-per-page="5" @actions="onActions" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LangTable from './lang-table.vue';
import type { LangTableItem } from './lang-table.vue';

const languages: LangTableItem[] = [
  {
    language: 'English',
    languageDirection: 'ltr',
    locale: 'en',
    activeTranslations: 24,
    translationProgress: 100,
    teamMembers: [
      {
        id: 1,
        name: 'Alice Chen',
        initials: 'AC',
        email: 'alice.chen@example.com',
        isManager: false,
        isAdmin: false,
        role: 'admin',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => false,
      },
      {
        id: 2,
        name: 'Bob Smith',
        initials: 'BS',
        email: 'bob.smith@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
    ],
    bibleTranslation: 'King James Version',
  },
  {
    language: 'Spanish',
    languageDirection: 'ltr',
    locale: 'es',
    activeTranslations: 18,
    translationProgress: 75,
    teamMembers: [
      {
        id: 3,
        name: 'Carlos García',
        initials: 'CG',
        email: 'carlos.garcía@example.com',
        isManager: false,
        isAdmin: false,
        role: 'admin',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
      {
        id: 4,
        name: 'Maria Lopez',
        initials: 'ML',
        email: 'maria.lopez@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
      {
        id: 5,
        name: 'Juan Pérez',
        initials: 'JP',
        email: 'juan.pérez@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
    ],
    bibleTranslation: 'Reina-Valera 1960',
  },
  {
    language: 'French',
    languageDirection: 'ltr',
    locale: 'fr',
    activeTranslations: 12,
    translationProgress: 50,
    teamMembers: [
      {
        id: 6,
        name: 'Pierre Dubois',
        initials: 'PD',
        email: 'pierre.dubois@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
    ],
    bibleTranslation: 'Louis Segond',
  },
  {
    language: 'Arabic',
    languageDirection: 'rtl',
    locale: 'ar',
    activeTranslations: 5,
    translationProgress: 25,
    teamMembers: [],
    bibleTranslation: 'Smith & Van Dyke',
  },
  {
    language: 'Portuguese',
    languageDirection: 'ltr',
    locale: 'pt',
    activeTranslations: 0,
    translationProgress: 0,
    teamMembers: [
      {
        id: 7,
        name: 'Ana Costa',
        initials: 'AC',
        email: 'ana.costa@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
    ],
    bibleTranslation: undefined,
  },
];

const manyLanguages: LangTableItem[] = [
  ...languages,
  {
    language: 'German',
    languageDirection: 'ltr',
    locale: 'de',
    activeTranslations: 8,
    translationProgress: 42,
    teamMembers: [
      {
        id: 8,
        name: 'Hans Müller',
        initials: 'HM',
        email: 'hans.müller@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
    ],
    bibleTranslation: 'Luther Bibel',
  },
  {
    language: 'Swahili',
    languageDirection: 'ltr',
    locale: 'sw',
    activeTranslations: 15,
    translationProgress: 88,
    teamMembers: [
      {
        id: 9,
        name: 'Juma Ochieng',
        initials: 'JO',
        email: 'juma.ochieng@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
      {
        id: 10,
        name: 'Amina Hassan',
        initials: 'AH',
        email: 'amina.hassan@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
    ],
    bibleTranslation: 'Biblia Habari Njema',
  },
  {
    language: 'Hindi',
    languageDirection: 'ltr',
    locale: 'hi',
    activeTranslations: 3,
    translationProgress: 12,
    teamMembers: [],
    bibleTranslation: 'Hindi Bible',
  },
  {
    language: 'Chinese (Simplified)',
    languageDirection: 'ltr',
    locale: 'zh',
    activeTranslations: 20,
    translationProgress: 92,
    teamMembers: [
      {
        id: 11,
        name: 'Wei Zhang',
        initials: 'WZ',
        email: 'wei.zhang@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
      {
        id: 12,
        name: 'Mei Lin',
        initials: 'ML',
        email: 'mei.lin@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
      {
        id: 13,
        name: 'Jin Wang',
        initials: 'JW',
        email: 'jin.wang@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
    ],
    bibleTranslation: 'Chinese Union Version',
  },
  {
    language: 'Russian',
    languageDirection: 'ltr',
    locale: 'ru',
    activeTranslations: 6,
    translationProgress: 35,
    teamMembers: [
      {
        id: 14,
        name: 'Ivan Petrov',
        initials: 'IP',
        email: 'ivan.petrov@example.com',
        isManager: false,
        isAdmin: false,
        role: 'editor',
        language: null,
        hasPendingInvite: false,
        isAllowed: () => true,
      },
    ],
    bibleTranslation: 'Synodal Translation',
  },
];

const onActions = (item: LangTableItem) => {
  alert(`Actions for ${item.language} (${item.locale})`);
};
</script>
