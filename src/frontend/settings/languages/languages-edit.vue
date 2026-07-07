<template>
  <AppLayout title="Settings" subtitle="Add new languages">
    <template #description>
      <p class="text-sm font-normal leading-5 text-black">
        Select languages you would like to add. Once you have chosen press add to confirm.
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
    <template #controls>
      <div
        v-if="selectedLanguages.length > 0"
        class="flex items-center justify-between pb-4"
      >
        <div class="flex items-center justify-start gap-4">
          <h3 class="text-xs font-medium uppercase leading-5 text-gray-800">Selected:</h3>

          <ul class="flex flex-wrap gap-x-4 gap-y-2">
            <li
              v-for="language in selectedLanguages"
              :key="language.locale"
              class="inline-flex items-center gap-2 rounded-full bg-gray-100 py-1.5 pl-3 pr-2 text-xs font-medium leading-4 text-gray-900"
            >
              {{ language.language }}
              <button
                type="button"
                class="text-gray-800"
                :aria-label="`Remove ${language.language}`"
                @click="setLocaleSelected(language.locale, false)"
              >
                <X class="size-3.5" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #main>
      <LanguageList :items="languageListItems" @update="setLocaleSelected" />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { X } from '@lucide/vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '../../shared/app-layout.vue';
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
  sortLanguagesByDisplayName,
} from '../../shared/helpers';
import { postWithPayload } from '../../shared/post-with-payload';

const props = defineProps<LanguagesEditProps & SharedPageProps>();

const shared = useSharedStore();

shared.setFromProps(props);
shared.setCurrentStoryName('');

const emit = defineEmits<{
  add: [locales: string[]];
}>();

const selectedLocales = ref<Set<string>>(new Set());

const addedLocales = computed(() => new Set(props.addedLanguages.map((l) => l.locale)));

const languageListItems = computed(() => {
  const listItems: LanguageListItemProps[] = allLanguages.map((language) => ({
    language,
    status: addedLocales.value.has(language.locale)
      ? 'readonly'
      : selectedLocales.value.has(language.locale)
        ? 'selected'
        : 'available',
  }));

  return listItems.sort((a, b) => compareLanguagesByDisplayName(a.language, b.language));
});

const selectedLanguages = computed(() =>
  sortLanguagesByDisplayName(
    languageListItems.value
      .filter((item) => item.status === 'selected')
      .map((item) => item.language),
  ),
);

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

  postWithPayload(
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
