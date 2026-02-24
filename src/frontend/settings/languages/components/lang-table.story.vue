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
import type { TableItem } from './lang-table.vue';

const isAllowed = (allowed: boolean) => () => allowed;

const languages: TableItem[] = [
  {
    language: 'English',
    languageDirection: 'ltr',
    locale: 'en',
    translationProgress: [
      { name: 'Interface', done: 100, draft: 0, total: 100 },
      { name: 'Content', done: 240, draft: 0, total: 240 },
    ],
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
        isAllowed: isAllowed(false),
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
        isAllowed: isAllowed(true),
      },
    ],
    bibleTranslation: 'King James Version',
  },
  {
    language: 'Spanish',
    languageDirection: 'ltr',
    locale: 'es',
    translationProgress: [
      { name: 'Interface', done: 75, draft: 0, total: 100 },
      { name: 'Content', done: 225, draft: 0, total: 300 },
    ],
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
        isAllowed: isAllowed(true),
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
        isAllowed: isAllowed(true),
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
        isAllowed: isAllowed(true),
      },
    ],
    bibleTranslation: 'Reina-Valera 1960',
  },
  {
    language: 'French',
    languageDirection: 'ltr',
    locale: 'fr',
    translationProgress: [
      { name: 'Interface', done: 50, draft: 0, total: 100 },
      { name: 'Content', done: 90, draft: 10, total: 150 },
    ],
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
        isAllowed: isAllowed(true),
      },
    ],
    bibleTranslation: 'Louis Segond',
  },
  {
    language: 'Arabic',
    languageDirection: 'rtl',
    locale: 'ar',

    translationProgress: [
      { name: 'Interface', done: 25, draft: 0, total: 100 },
      { name: 'Content', done: 50, draft: 0, total: 200 },
    ],
    teamMembers: [],
    bibleTranslation: 'Smith & Van Dyke',
  },
  {
    language: 'Portuguese',
    languageDirection: 'ltr',
    locale: 'pt',

    translationProgress: [
      { name: 'Interface', done: 0, draft: 0, total: 100 },
      { name: 'Content', done: 0, draft: 0, total: 100 },
    ],
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
        isAllowed: isAllowed(true),
      },
    ],
    bibleTranslation: undefined,
  },
];

const manyLanguages: TableItem[] = [
  ...languages,
  {
    language: 'German',
    languageDirection: 'ltr',
    locale: 'de',

    translationProgress: [
      { name: 'Interface', done: 42, draft: 0, total: 100 },
      { name: 'Content', done: 84, draft: 0, total: 200 },
    ],
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
        isAllowed: isAllowed(true),
      },
    ],
    bibleTranslation: 'Luther Bibel',
  },
  {
    language: 'Swahili',
    languageDirection: 'ltr',
    locale: 'sw',

    translationProgress: [
      { name: 'Interface', done: 88, draft: 0, total: 100 },
      { name: 'Content', done: 264, draft: 0, total: 300 },
    ],
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
        isAllowed: isAllowed(true),
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
        isAllowed: isAllowed(true),
      },
    ],
    bibleTranslation: 'Biblia Habari Njema',
  },
  {
    language: 'Hindi',
    languageDirection: 'ltr',
    locale: 'hi',

    translationProgress: [
      { name: 'Interface', done: 12, draft: 0, total: 100 },
      { name: 'Content', done: 36, draft: 0, total: 300 },
    ],
    teamMembers: [],
    bibleTranslation: 'Hindi Bible',
  },
  {
    language: 'Chinese (Simplified)',
    languageDirection: 'ltr',
    locale: 'zh',

    translationProgress: [
      { name: 'Interface', done: 92, draft: 0, total: 100 },
      { name: 'Content', done: 460, draft: 40, total: 500 },
    ],
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
        isAllowed: isAllowed(true),
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
        isAllowed: isAllowed(true),
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
        isAllowed: isAllowed(true),
      },
    ],
    bibleTranslation: 'Chinese Union Version',
  },
  {
    language: 'Russian',
    languageDirection: 'ltr',
    locale: 'ru',

    translationProgress: [
      { name: 'Interface', done: 35, draft: 0, total: 100 },
      { name: 'Content', done: 105, draft: 0, total: 300 },
    ],
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
        isAllowed: isAllowed(true),
      },
    ],
    bibleTranslation: 'Synodal Translation',
  },
];

const onActions = (item: TableItem) => {
  alert(`Actions for ${item.language} (${item.locale})`);
};
</script>
