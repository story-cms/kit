<template>
  <LanguageModal :open="open" title="Bible translations available" @close="handleClose">
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
      <Listbox v-else v-model="selectedBibleVersion" as="div" class="relative">
        <ListboxButton
          class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-left text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <span class="block truncate">
            {{ selectedBibleVersion?.bibleLabel ?? 'Select translation' }}
          </span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <Icon name="chevron-down" class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-for="version in shared.bibleTranslations"
              :key="version.bibleVersionId"
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
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </Listbox>
    </div>

    <template #actions>
      <PillButton label="Cancel" variant="gray" @click="handleClose" />
      <PillButton
        label="Confirm selection"
        variant="green"
        :disabled="isLoading || hasError"
        @click="handleConfirm"
      />
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import axios, { AxiosError } from 'axios';
import { useWidgetsStore, useSharedStore } from '../../../../store';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import Icon from '../../../../shared/icon.vue';
import LanguageModal from '../language-modal.vue';
import PillButton from '../../../../shared/pill-button.vue';
import type { LanguageTableItem, LanguageSpecification } from '../../../../../types';

const widgets = useWidgetsStore();
const shared = useSharedStore();

type BibleVersion = Omit<LanguageSpecification, 'languageDirection' | 'locale'>;
const selectedBibleVersion = ref<BibleVersion | null>(null);
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');

const props = defineProps<{
  open: boolean;
  item: LanguageTableItem | null;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [bibleVersionId: string, bibleVersionName: string];
}>();

watch(
  () => [props.open, props.item] as const,
  ([isOpen, item]) => {
    if (isOpen && item) {
      const current = shared.bibleTranslations.find(
        (v) =>
          v.bibleVersionId === item.bibleVersionId || v.bibleLabel === item.bibleLabel,
      );
      selectedBibleVersion.value = current ?? shared.bibleTranslations[0] ?? null;
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
      selectedBibleVersion.value.bibleVersionId ?? '',
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
  const apiKey = widgets.providers.scripture?.bibleApiKey;
  if (!apiKey) {
    return [];
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

onMounted(async () => {
  isLoading.value = true;
  hasError.value = false;
  try {
    const versions = await getBibleVersions();
    shared.setBibleTranslations(transformBibleVersions(versions));
  } catch {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
});

const transformBibleVersions = (
  versions: Array<APIBibleVersion>,
): Array<BibleVersion> => {
  return versions.map((version) => ({
    language: version.language,
    bibleVersion: version.name,
    bibleVersionId: version.id,
    bibleLabel: `(${version.abbreviation}) ${version.name}`,
  }));
};
</script>
