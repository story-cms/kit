<template>
  <AppLayout>
    <StickyHeader>
      <div class="container px-3 mx-auto">
        <div class="flex items-center justify-between py-6">
          <h2 class="text-2xl font-semibold leading-8 text-gray-800">Languages</h2>
          <ul class="flex items-center gap-x-4 font-['Inter']">
            <li class="flex items-center gap-x-4">
              <span class="size-[14px] bg-[#10B981]"></span>
              <span class="text-lg font-medium leading-7 text-gray-500"
                >Human translator</span
              >
            </li>
            <li class="flex items-center gap-x-4">
              <span class="size-[14px] bg-[#3B82F6]"></span>
              <span class="text-lg font-medium leading-7 text-gray-500"
                >AI translation</span
              >
            </li>
          </ul>
        </div>
      </div>
    </StickyHeader>
    <section class="container px-3 mx-auto">
      <ul class="grid grid-cols-2 gap-4">
        <li v-for="translation in translations" :key="translation.locale">
          <UiIndexCard
            :locale="translation.locale"
            :language="translation.language"
            :human-translation="translation.humanTranslation"
            :ai-translation="translation.aiTranslation"
            :total-translation="translation.totalCount"
            :updated-at="translation.updatedAt"
          />
        </li>
      </ul>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../shared/app-layout.vue';
import { useSharedStore } from '../store';
import type { UiIndexProps, SharedPageProps } from '../../types';
import StickyHeader from '../shared/sticky-header.vue';

import UiIndexCard from './components/ui-index-card.vue';

const props = defineProps<SharedPageProps & UiIndexProps>();

const shared = useSharedStore();
shared.setFromProps(props);

const translations = [
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
    humanTranslation: 2,
    aiTranslation: 0,
    totalCount: 345,
    updatedAt: '2024-03-13T10:25:56.814+00:00',
  },
];
</script>
