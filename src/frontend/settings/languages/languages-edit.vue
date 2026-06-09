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
          <PillButton
            label="Add"
            variant="blue"
            :disabled="selectedLanguages.length === 0"
            @click="addLanguage"
          />
        </template>
        <template #extra-actions>
          <div
            v-if="selectedLanguages.length > 0"
            class="flex items-center justify-between pb-4"
          >
            <div>
              <h3 class="text-sm font-medium leading-5 text-gray-800">Selected</h3>

              <ul class="mt-2 flex flex-wrap gap-2">
                <li
                  v-for="language in selectedLanguages"
                  :key="language.locale"
                  class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium leading-4 text-blue-800"
                >
                  {{ language.language }}
                  <button
                    type="button"
                    @click="setLocaleSelected(language.locale, false)"
                  >
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
    <LanguageList :items="languageListItems" @update="setLocaleSelected" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '../../shared/app-layout.vue';
import ContentHeader from '../../shared/content-header.vue';
import PillButton from '../../shared/pill-button.vue';
import LanguageList from './language-list.vue';
import {
  ResponseStatus,
  type LanguageListItemProps,
  type LanguagesEditProps,
  type LanguageSpecification,
  type SharedPageProps,
} from '../../../types';
import { languages as allLanguages } from './languages';
import { useSharedStore } from '../../store';
import {
  compareLanguagesByDisplayName,
  postSettings,
  sortLanguagesByDisplayName,
} from '../../shared/helpers';

const props = defineProps<LanguagesEditProps & SharedPageProps>();

const shared = useSharedStore();

shared.setFromProps(props);
shared.setCurrentStoryName('');

const emit = defineEmits<{
  add: [locales: string[]];
}>();

const selectedLocales = ref<Set<string>>(new Set());

const addedLocales = computed(() => new Set(props.addedLanguages.map((l) => l.locale)));

const languageState = computed(() => {
  const listItems: LanguageListItemProps[] = [];
  const selected: LanguageSpecification[] = [];

  for (const language of allLanguages) {
    const status = addedLocales.value.has(language.locale)
      ? 'readonly'
      : selectedLocales.value.has(language.locale)
        ? 'selected'
        : 'available';

    listItems.push({ language, status });
    if (status === 'selected') selected.push(language);
  }

  return {
    listItems: listItems.sort((a, b) =>
      compareLanguagesByDisplayName(a.language, b.language),
    ),
    selectedLanguages: sortLanguagesByDisplayName(selected),
  };
});

const languageListItems = computed(() => languageState.value.listItems);
const selectedLanguages = computed(() => languageState.value.selectedLanguages);

const setLocaleSelected = (locale: string, isSelected: boolean) => {
  const next = new Set(selectedLocales.value);
  if (isSelected) next.add(locale);
  else next.delete(locale);
  selectedLocales.value = next;
};

const languageAddedMessage = (count: number) =>
  count === 1 ? 'Your language has been added.' : 'Your languages have been added.';

const addLanguage = () => {
  const languages = [...selectedLanguages.value];
  submitLanguages(languages);
  emit('add', [...selectedLocales.value]);
  selectedLocales.value = new Set();
};

const submitLanguages = (languages: LanguageSpecification[]) => {
  const payload = languages.map(({ locale, language, languageDirection }) => ({
    locale,
    language,
    languageDirection,
  }));

  postSettings(
    `/${shared.locale}/settings/languages/add`,
    { languages: payload },
    {
      failureMessage: 'Error adding languages',
      onSuccess: () => {
        router.visit(`/${shared.locale}/settings`, {
          preserveScroll: true,
          onSuccess: () => {
            shared.addMessage(
              ResponseStatus.Confirmation,
              languageAddedMessage(languages.length),
              'Remember, once you’ve translated your content you’ll need to request an app update to make these live for your users.',
            );
          },
        });
      },
    },
  );
};
</script>
