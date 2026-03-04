<template>
  <div class="border-2 border-black/5 sm:rounded-lg">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50 uppercase">
        <tr>
          <th
            scope="col"
            class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
          >
            Active translations
          </th>
          <th
            scope="col"
            class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
          >
            Translation progress
          </th>
          <th
            scope="col"
            class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
          >
            Team members
          </th>
          <th
            scope="col"
            class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
          >
            Bible translation
          </th>
          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="item in paginatedItems" :key="item.locale" class="relative">
          <td
            class="flex flex-col gap-2 whitespace-nowrap px-3 py-4 text-sm text-gray-800"
          >
            <LangStrip :spec="item" />
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm">
            <RingBlock :progress="item.translationProgress ?? []" />
          </td>
          <td class="px-3 py-4 text-sm text-gray-800">
            <div v-if="item.teamMembers?.length" class="flex flex-col gap-1">
              <MemberRow
                v-for="member in item.teamMembers"
                :key="member.id"
                :name="member.name"
                :email="member.email"
              />
            </div>
            <div v-else class="flex flex-col text-xs font-medium leading-4">
              <p class="text-black">No team members yet</p>
              <p class="text-gray-500">
                Press the three dots to <br />
                assign team members.
              </p>
            </div>
          </td>
          <td
            class="whitespace-nowrap px-3 py-4 text-sm font-normal leading-5 text-gray-500"
          >
            {{ truncate(item.bibleLabel, 30) }}
          </td>
          <td class="py-4 pl-3 pr-4 text-right sm:pr-6">
            <button
              type="button"
              class="cursor-pointer text-gray-400 hover:text-gray-600"
              @click="toggleActions(item.locale)"
            >
              <Icon name="dots-vertical" class="size-5" />
            </button>
            <div
              v-show="openActionsLocale === item.locale"
              class="absolute right-10 top-3 z-10 flex max-w-[250px] flex-col items-start overflow-hidden rounded-md bg-white shadow"
            >
              <a
                href="/{{ item.locale }}/user"
                class="w-full px-6 py-2 pt-3 text-left text-sm font-normal leading-5 text-gray-800 hover:bg-gray-100"
              >
                Assign team members
              </a>
              <button
                class="w-full px-6 py-2 text-left text-sm font-normal leading-5 text-gray-800 hover:bg-gray-100"
                @click="openBibleTranslationsModal(item)"
              >
                Change Bible translation
              </button>
              <button
                class="w-full px-6 py-2 pb-3 text-left text-sm font-normal leading-5 text-gray-800 hover:bg-gray-100"
                @click="handleRemoveOrRequestDeletion(item)"
              >
                {{ hasContent(item) ? 'Request language deletion' : 'Remove language' }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <LanguageModal
      :open="removeModalLocale !== null"
      title="Remove language"
      message="Are you sure you want to remove this language? All your unpublished translation work will be lost."
      @close="removeModalLocale = null"
    >
      <template #actions>
        <PillButton label="Cancel" variant="gray" @click="removeModalLocale = null" />
        <PillButton label="Remove" variant="red" @click="confirmRemove" />
      </template>
    </LanguageModal>

    <LanguageModal
      :open="requestDeletionModalLocale !== null"
      title="Remove language"
      message="Are you sure you want to request to remove this language? All your progress will be lost."
      @close="requestDeletionModalLocale = null"
    >
      <template #actions>
        <PillButton
          label="Cancel"
          variant="gray"
          @click="requestDeletionModalLocale = null"
        />
        <PillButton
          label="Request removal"
          variant="red"
          @click="confirmRequestDeletion"
        />
      </template>
    </LanguageModal>

    <LanguageModal
      :open="bibleTranslationsModalLocale !== null"
      title="Change Bible translation"
      @close="closeBibleTranslationsModal"
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
        <PillButton label="Cancel" variant="gray" @click="closeBibleTranslationsModal" />
        <PillButton
          label="Confirm selection"
          variant="green"
          @click="bibleTranslationChange"
        />
      </template>
    </LanguageModal>

    <Pagination
      :current-page="currentPage"
      :total-items="items.length"
      :items-per-page="itemsPerPage"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import Icon from '../../../shared/icon.vue';
import Pagination from '../../../shared/pagination.vue';
import PillButton from '../../../shared/pill-button.vue';
import LanguageModal from './language-modal.vue';
import type { LanguageTableItem } from '../../../../types';
import MemberRow from './member-row.vue';
import RingBlock from '../../../dashboard/ring-block.vue';
import LangStrip from './language-strip.vue';

const BIBLE_VERSIONS = [
  { id: 'eng-ESV', name: 'English Standard Version' },
  { id: 'eng-NIV', name: 'New International Version' },
  { id: 'eng-NLT', name: 'New Living Translation' },
  { id: 'eng-NASB', name: 'New American Standard Bible' },
  { id: 'eng-KJV', name: 'King James Version' },
] as const;

const props = withDefaults(
  defineProps<{
    items: LanguageTableItem[];
    itemsPerPage?: number;
  }>(),
  { itemsPerPage: 10 },
);

const emit = defineEmits<{
  remove: [item: LanguageTableItem];
  requestDeletion: [item: LanguageTableItem];
  bibleTranslationChange: [
    item: LanguageTableItem,
    bibleVersionId: string,
    bibleVersionName: string,
  ];
}>();

const currentPage = ref(1);
const paginatedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * props.itemsPerPage;
  const endIndex = startIndex + props.itemsPerPage;
  return props.items.slice(startIndex, endIndex);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const openActionsLocale = ref<string | null>(null);
const removeModalLocale = ref<string | null>(null);
const requestDeletionModalLocale = ref<string | null>(null);
const bibleTranslationsModalLocale = ref<string | null>(null);
const selectedBibleVersion = ref<{ id: string; name: string } | null>(null);

const toggleActions = (locale: string) => {
  openActionsLocale.value = openActionsLocale.value === locale ? null : locale;
};

const handleRemoveOrRequestDeletion = (item: LanguageTableItem) => {
  openActionsLocale.value = null;
  if (hasContent(item)) {
    requestDeletionModalLocale.value = item.locale;
  } else {
    removeModalLocale.value = item.locale;
  }
};

const confirmRemove = () => {
  const item = props.items.find((i) => i.locale === removeModalLocale.value);
  if (item) emit('remove', item);
  removeModalLocale.value = null;
};

const confirmRequestDeletion = () => {
  const item = props.items.find((i) => i.locale === requestDeletionModalLocale.value);
  if (item) emit('requestDeletion', item);
  requestDeletionModalLocale.value = null;
};

const openBibleTranslationsModal = (item: LanguageTableItem) => {
  openActionsLocale.value = null;
  bibleTranslationsModalLocale.value = item.locale;
  const current = BIBLE_VERSIONS.find(
    (v) => v.id === item.bibleVersionId || v.name === item.bibleLabel,
  );
  selectedBibleVersion.value = current ?? BIBLE_VERSIONS[0];
};

const closeBibleTranslationsModal = () => {
  bibleTranslationsModalLocale.value = null;
};

const bibleTranslationChange = () => {
  const item = props.items.find((i) => i.locale === bibleTranslationsModalLocale.value);
  if (item && selectedBibleVersion.value) {
    emit(
      'bibleTranslationChange',
      item,
      selectedBibleVersion.value.id,
      selectedBibleVersion.value.name,
    );
  }
  closeBibleTranslationsModal();
};

const truncate = (s: string | null | undefined, max: number) => {
  const text = s ?? '—';
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

const hasContent = (item: LanguageTableItem) =>
  item.translationProgress?.every((progress) => progress.done > 0) ?? false;
</script>
