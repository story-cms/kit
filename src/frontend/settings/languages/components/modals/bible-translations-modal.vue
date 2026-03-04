<template>
  <LanguageModal :open="open" title="Bible translations available" @close="handleClose">
    <div class="space-y-4 pb-[130px]">
      <Listbox v-model="selectedBibleVersion" as="div" class="relative">
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
              v-for="version in BIBLE_VERSIONS"
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
      <PillButton label="Confirm selection" variant="green" @click="handleConfirm" />
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import Icon from '../../../../shared/icon.vue';
import LanguageModal from '../language-modal.vue';
import PillButton from '../../../../shared/pill-button.vue';
import type { LanguageTableItem, LanguageSpecification } from '../../../../../types';

const BIBLE_VERSIONS: Omit<
  LanguageSpecification,
  'language' | 'languageDirection' | 'locale'
>[] = [
  {
    bibleVersion: 'English Standard Version',
    bibleVersionId: 'de4e12af7f28f599-02',
    bibleLabel: '(ESV) English Standard Version',
  },
  {
    bibleVersion: 'New International Version',
    bibleVersionId: 'de4e12af7f28f599-03',
    bibleLabel: '(NIV) New International Version',
  },
  {
    bibleVersion: 'New Living Translation',
    bibleVersionId: 'de4e12af7f28f599-04',
    bibleLabel: '(NLT) New Living Translation',
  },
  {
    bibleVersion: 'New American Standard Bible',
    bibleVersionId: 'de4e12af7f28f599-05',
    bibleLabel: '(NASB) New American Standard Bible',
  },
  {
    bibleVersion: 'King James Version',
    bibleVersionId: 'de4e12af7f28f599-01',
    bibleLabel: '(KJV) King James Version',
  },
] as const;

const props = defineProps<{
  open: boolean;
  item: LanguageTableItem | null;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [bibleVersionId: string, bibleVersionName: string];
}>();

type BibleVersion = (typeof BIBLE_VERSIONS)[number];
const selectedBibleVersion = ref<BibleVersion | null>(null);

watch(
  () => [props.open, props.item] as const,
  ([isOpen, item]) => {
    if (isOpen && item) {
      const current = BIBLE_VERSIONS.find(
        (v) =>
          v.bibleVersionId === item.bibleVersionId || v.bibleLabel === item.bibleLabel,
      );
      selectedBibleVersion.value = current ?? BIBLE_VERSIONS[0];
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
</script>
