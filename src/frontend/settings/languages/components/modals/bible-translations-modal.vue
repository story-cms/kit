<template>
  <LanguageModal
    :open="open"
    title="Change Bible translation"
    @close="handleClose"
  >
    <div class="space-y-4 pb-[130px]">
      <Listbox v-model="selectedBibleVersion" as="div" class="relative">
        <ListboxButton
          class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-left text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <span class="block truncate">
            {{ selectedBibleVersion?.name ?? 'Select translation' }}
          </span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <Icon
              name="chevron-down"
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
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
              :key="version.id"
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
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'block truncate',
                  ]"
                >
                  {{ version.name }}
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
        @click="handleConfirm"
      />
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import Icon from '../../../../shared/icon.vue';
import LanguageModal from '../language-modal.vue';
import PillButton from '../../../../shared/pill-button.vue';
import type { LanguageTableItem } from '../../../../../types';

const BIBLE_VERSIONS = [
  { id: 'eng-ESV', name: 'English Standard Version' },
  { id: 'eng-NIV', name: 'New International Version' },
  { id: 'eng-NLT', name: 'New Living Translation' },
  { id: 'eng-NASB', name: 'New American Standard Bible' },
  { id: 'eng-KJV', name: 'King James Version' },
] as const;

const props = defineProps<{
  open: boolean;
  item: LanguageTableItem | null;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [bibleVersionId: string, bibleVersionName: string];
}>();

const selectedBibleVersion = ref<{ id: string; name: string } | null>(null);

watch(
  () => [props.open, props.item] as const,
  ([isOpen, item]) => {
    if (isOpen && item) {
      const current = BIBLE_VERSIONS.find(
        (v) => v.id === item.bibleVersionId || v.name === item.bibleLabel,
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
    emit('confirm', selectedBibleVersion.value.id, selectedBibleVersion.value.name);
  }
  emit('close');
};
</script>
