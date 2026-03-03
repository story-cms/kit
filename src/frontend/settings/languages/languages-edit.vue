<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Add new languages">
        <template #description>
          <p class="text-sm font-normal leading-5 text-black">
            Select languages you would like to add. Once you have chosen press add to
            confirm.
          </p>
        </template>
        <template #actions>
          <button
            class="rounded-[38px] border bg-blue-500 px-[15px] py-[9px] text-sm/5 font-medium text-white shadow hover:bg-blue-400 focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset]"
            @click="addLanguage"
          >
            Add
          </button>
        </template>
        <template #extra-actions>
          <div
            v-if="selectedLanguages.length > 0"
            class="flex items-center justify-between pb-4"
          >
            <div>
              <h3 class="text-sm font-medium leading-5 text-gray-800">Selected</h3>

              <ul class="mt-2 flex flex-wrap gap-4">
                <li
                  v-for="language in selectedLanguages"
                  :key="language.locale"
                  class="flex items-center justify-between gap-2 rounded-full bg-blue-100 px-[10px] py-1 text-sm font-medium leading-5"
                >
                  <span class="text-sm font-normal leading-5 text-blue-800">
                    {{ language.language }}</span
                  >
                  <button @click="removeSelectedLanguage(language.locale)">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.75 0.75L0.75 6.75M0.75 0.75L6.75 6.75L0.75 0.75Z"
                        stroke="#9CA3AF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </ContentHeader>
    </template>
    <LanguageList :items="languageListItems" @update="handleSelectionUpdate" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AppLayout from '../../shared/app-layout.vue';
import ContentHeader from '../../shared/content-header.vue';
import LanguageList from './language-list.vue';

import type { LanguageSpecification } from '../../../types';
import { languages as allLanguages } from './languages';

const props = defineProps<{
  addedLanguages: LanguageSpecification[];
}>();

const selectedLocales = ref<Set<string>>(new Set());

const availableLanguageItems = computed(() =>
  allLanguages
    .filter((language: LanguageSpecification) => !props.addedLanguages.includes(language))
    .map((language: LanguageSpecification) => ({
      language,
      isSelected: selectedLocales.value.has(language.locale),
      isAdded: false,
    })),
);

const selectedLanguages = computed(() =>
  allLanguages.filter((language) => selectedLocales.value.has(language.locale)),
);

const handleSelectionUpdate = (locale: string, isSelected: boolean) => {
  const next = new Set(selectedLocales.value);
  if (isSelected) next.add(locale);
  else next.delete(locale);
  selectedLocales.value = next;
};

const addedLanguageItems = computed(() =>
  props.addedLanguages.map((language: LanguageSpecification) => ({
    language,
    isSelected: false,
    isAdded: true,
  })),
);

const languageListItems = computed(() =>
  [...addedLanguageItems.value, ...availableLanguageItems.value].sort((a, b) =>
    a.language.language.localeCompare(b.language.language),
  ),
);

const removeSelectedLanguage = (locale: string) => {
  const next = new Set(selectedLocales.value);
  next.delete(locale);
  selectedLocales.value = next;
};

const addLanguage = () => {
  console.log('addLanguage');
};
</script>
