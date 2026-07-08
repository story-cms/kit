<template>
  <LanguageModal
    :open="open"
    title="Bible translations available"
    :hide-close-button="true"
    @close="handleClose"
  >
    <div class="space-y-4 pb-[130px]">
      <div
        v-if="isLoading || hasError"
        class="flex min-h-[160px] flex-col items-center justify-center gap-3"
      >
        <div v-if="isLoading" class="flex items-center gap-3">
          <Icon name="spinner" class="size-5 text-blue-500" />
          <span class="text-sm text-gray-600">Getting translations…</span>
        </div>
        <div v-else class="flex flex-col items-center gap-2 text-center">
          <span class="text-sm text-red-600">Failed to load translations.</span>
          <span class="text-xs text-gray-500">{{ errorMessage }}</span>
        </div>
      </div>
      <div
        v-else-if="currentBibleTranslations.length === 0"
        class="flex min-h-[160px] flex-col items-center justify-center gap-2 text-center"
      >
        <span class="text-sm text-gray-600"
          >No Bible translations available for this language.</span
        >
      </div>
      <Combobox
        v-else
        v-model="selectedBibleVersion"
        by="bibleVersion"
        nullable
        as="div"
        class="relative"
      >
        <div class="grid grid-cols-1">
          <ComboboxInput
            :class="[
              'col-start-1 row-start-1 w-full rounded-xl border border-gray-300 bg-white py-2.5 pr-10 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
              showSearchIcon ? 'pl-10' : 'pl-3',
            ]"
            placeholder="Search"
            :display-value="displayBibleLabel"
            @change="onComboboxInputChange"
          />
          <Icon
            v-if="showSearchIcon"
            name="search"
            class="pointer-events-none col-start-1 row-start-1 ml-3 size-4 self-center text-gray-400"
            aria-hidden="true"
          />
          <ComboboxButton
            class="col-start-1 row-start-1 flex items-center justify-self-end pr-2"
          >
            <Icon name="chevron-down" class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ComboboxOptions
            class="absolute z-10 my-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <li
              v-if="filteredBibleTranslations.length === 0"
              class="relative cursor-default select-none px-3 py-2 text-sm text-gray-500"
            >
              No translations match your search.
            </li>
            <ComboboxOption
              v-for="version in filteredBibleTranslations"
              :key="version.bibleVersion"
              v-slot="{ active, selected }"
              :value="version"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                ]"
              >
                <span
                  :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']"
                >
                  {{ version.bibleLabel }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
                >
                  <Icon name="check" class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </transition>
      </Combobox>
    </div>

    <template #actions>
      <div class="flex w-full justify-end gap-x-4">
        <StudioButton label="Cancel" variant="gray" @click="handleClose" />
        <StudioButton
          label="Confirm selection"
          variant="green"
          :disabled="isLoading || hasError || currentBibleTranslations.length === 0"
          @click="handleConfirm"
        />
      </div>
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import axios, { AxiosError } from 'axios';
import { useWidgetsStore, useSharedStore } from '../../../store';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue';
import Icon from '../../../shared/icon.vue';
import LanguageModal from './language-modal.vue';
import StudioButton from '../../../shared/studio-button.vue';
import { languageMatches } from '../../../shared/helpers';
import type { LanguageTableItem, LanguageSpecification } from '../../../../types';

const widgets = useWidgetsStore();
const shared = useSharedStore();

type BibleVersion = Omit<LanguageSpecification, 'languageDirection' | 'locale'>;
const selectedBibleVersion = ref<BibleVersion | null>(null);
const query = ref('');
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');

const props = defineProps<{
  open: boolean;
  item: LanguageTableItem | null;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [bibleVersion: string, bibleVersionName: string];
}>();

const displayBibleLabel = (version: unknown) =>
  (version as BibleVersion | null)?.bibleLabel ?? '';

const showSearchIcon = computed(
  () => query.value !== '' || displayBibleLabel(selectedBibleVersion.value) === '',
);

const onComboboxInputChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  query.value = value;
  if (value === '') {
    selectedBibleVersion.value = null;
  }
};

watch(selectedBibleVersion, () => {
  query.value = '';
});

watch(
  () => [props.open, props.item] as const,
  ([isOpen, item]) => {
    if (isOpen && item) {
      query.value = '';
      const filtered = shared.bibleTranslations.filter((v) =>
        languageMatches(item.language, v.language),
      );
      const current = filtered.find(
        (v) => v.bibleVersion === item.bibleVersion || v.bibleLabel === item.bibleLabel,
      );
      selectedBibleVersion.value = current ?? filtered[0] ?? null;
    }
  },
  { immediate: true },
);

const handleClose = () => {
  emit('close');
};

const handleConfirm = () => {
  if (selectedBibleVersion.value) {
    emit(
      'confirm',
      selectedBibleVersion.value.bibleVersion ?? '',
      selectedBibleVersion.value.bibleLabel ?? '',
    );
  }
  emit('close');
};

type APIBibleVersion = {
  name: string;
  id: string;
  abbreviation: string;
  description: string;
  language: string;
};

const getBibleVersions = async (): Promise<Array<APIBibleVersion>> => {
  const apiKey = widgets.providers.scripture?.bibleApiKey?.trim();
  if (!apiKey) {
    errorMessage.value =
      'Bible API key is not configured. Set BIBLE_API_KEY in your environment.';
    throw new Error('Missing Bible API key');
  }
  try {
    const res = await axios.get('https://api.scripture.api.bible/v1/bibles', {
      headers: { 'api-key': apiKey },
    });
    const { data } = res.data;
    return (data ?? []).map((item: Record<string, unknown>) => ({
      name: item.name,
      id: item.id,
      abbreviation: item.abbreviation,
      description: item.description,
      language: (item.language as { name?: string })?.name ?? '',
    }));
  } catch (err) {
    errorMessage.value =
      (err as AxiosError<{ message: string }>).response?.data?.message ??
      'Failed to load translations. Please try again later.';
    throw err;
  }
};

const transformBibleVersions = (
  versions: Array<APIBibleVersion>,
): Array<BibleVersion> => {
  return versions.map((version) => ({
    language: version.language,
    bibleVersion: version.id,
    bibleLabel: `(${version.abbreviation}) ${version.name}`,
  }));
};

const currentBibleTranslations = computed(() => {
  const itemLanguage = props.item?.language ?? '';
  return shared.bibleTranslations.filter((v) =>
    languageMatches(itemLanguage, v.language),
  );
});

const filteredBibleTranslations = computed(() => {
  if (query.value === '') {
    return currentBibleTranslations.value;
  }
  const normalizedQuery = query.value.toLowerCase();
  return currentBibleTranslations.value.filter((version) =>
    version.bibleLabel?.toLowerCase().includes(normalizedQuery),
  );
});

const loadBibleTranslations = async () => {
  if (shared.bibleTranslations.length > 0) {
    hasError.value = false;
    errorMessage.value = '';
    return;
  }

  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';
  try {
    const versions = await getBibleVersions();
    shared.setBibleTranslations(transformBibleVersions(versions));
  } catch {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      query.value = '';
      void loadBibleTranslations();
    }
  },
);
</script>
