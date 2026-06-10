<template>
  <div class="pb-6 pl-3">
    <h3 class="text-xl font-semibold leading-7 text-black">Active languages</h3>
    <p class="text-sm font-normal leading-5 text-black">
      You can manage your languages here.
    </p>
  </div>
  <div class="border-2 border-black/5 sm:rounded-lg">
    <table class="w-full divide-y divide-gray-300 table-fixed">
      <colgroup>
        <col class="w-[24%]" />
        <col class="w-[16%]" />
        <col class="w-[30%]" />
        <col class="w-[22%]" />
        <col class="w-[8%]" />
      </colgroup>
      <thead class="uppercase bg-gray-50">
        <tr>
          <th
            scope="col"
            class="px-3 py-3 max-w-0 text-xs font-medium tracking-wide text-left text-gray-500 uppercase"
          >
            Active translations
          </th>
          <th
            scope="col"
            class="px-3 py-3 text-xs font-medium tracking-wide text-left text-gray-500 uppercase"
          >
            Translation progress
          </th>
          <th
            scope="col"
            class="px-3 py-3 max-w-0 text-xs font-medium tracking-wide text-left text-gray-500 uppercase"
          >
            Team members
          </th>
          <th
            scope="col"
            class="px-3 py-3 max-w-0 text-xs font-medium tracking-wide text-left text-gray-500 uppercase"
          >
            Bible translation
          </th>
          <th scope="col" class="relative py-3.5 pr-4 pl-3 w-12 sm:pr-6">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <LanguageTableRow
          v-for="row in displayRows"
          :key="row.item.locale"
          :item="row.item"
          :is-source="row.isSource"
          :deletion-mode="row.deletionMode"
          :open-actions-locale="openActionsLocale"
          @toggle-actions="toggleActions"
          @open-bible-translations="openBibleTranslationsModal"
          @remove-or-request-deletion="handleRemoveOrRequestDeletion"
        />
      </tbody>
    </table>

    <RemoveLanguageModal
      :open="removeModalLocale !== null"
      @close="removeModalLocale = null"
      @confirm="confirmRemove"
    />

    <RequestDeletionModal
      :open="requestDeletionModalLocale !== null"
      @close="requestDeletionModalLocale = null"
      @confirm="confirmRequestDeletion"
    />

    <BibleTranslationsModal
      :open="bibleTranslationsModalLocale !== null"
      :item="bibleTranslationsModalItem"
      @close="closeBibleTranslationsModal"
      @confirm="handleBibleTranslationConfirm"
    />

    <Pagination
      v-if="totalItems > itemsPerPage"
      :current-page="currentPage"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Pagination from '../../../shared/pagination.vue';
import RemoveLanguageModal from './remove-language-modal.vue';
import RequestDeletionModal from './request-deletion-modal.vue';
import BibleTranslationsModal from './bible-translations-modal.vue';
import LanguageTableRow from './language-table-row.vue';
import type { LanguageTableItem } from '../../../../types';
import { sortLanguagesByDisplayName } from '../../../shared/helpers';

const props = withDefaults(
  defineProps<{
    items: LanguageTableItem[];
    sourceLanguage: LanguageTableItem;
    itemsPerPage?: number;
  }>(),
  { itemsPerPage: 10 },
);

const emit = defineEmits<{
  remove: [item: LanguageTableItem];
  requestDeletion: [item: LanguageTableItem];
  bibleTranslationChange: [
    item: LanguageTableItem,
    bibleVersion: string,
    bibleVersionName: string,
  ];
}>();

const hasTranslationContent = (item: LanguageTableItem) => {
  const content = item.translationProgress?.find((p) => p.name === 'Content');
  const ui = item.translationProgress?.find((p) => p.name === 'Interface');
  return (content?.done ?? 0) > 0 || (ui?.done ?? 0) > 0;
};

const currentPage = ref(1);
const sortedItems = computed(() => sortLanguagesByDisplayName(props.items));
const totalItems = computed(() => props.items.length + 1);

const paginatedItems = computed(() => {
  const sorted = sortedItems.value;

  if (currentPage.value === 1) {
    return sorted.slice(0, props.itemsPerPage - 1);
  }

  const startIndex =
    props.itemsPerPage - 1 + (currentPage.value - 2) * props.itemsPerPage;
  return sorted.slice(startIndex, startIndex + props.itemsPerPage);
});

const displayRows = computed(() => {
  const sourceRow =
    currentPage.value === 1
      ? [{ item: props.sourceLanguage, isSource: true, deletionMode: undefined }]
      : [];

  return [
    ...sourceRow,
    ...paginatedItems.value.map((item) => ({
      item,
      isSource: false,
      deletionMode: hasTranslationContent(item)
        ? ('request' as const)
        : ('remove' as const),
    })),
  ];
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const openActionsLocale = ref<string | null>(null);
const removeModalLocale = ref<string | null>(null);
const requestDeletionModalLocale = ref<string | null>(null);
const bibleTranslationsModalLocale = ref<string | null>(null);

const allLanguageItems = computed(() => [props.sourceLanguage, ...props.items]);

const bibleTranslationsModalItem = computed(
  () =>
    allLanguageItems.value.find(
      (item) => item.locale === bibleTranslationsModalLocale.value,
    ) ?? null,
);

const toggleActions = (locale: string) => {
  openActionsLocale.value = openActionsLocale.value === locale ? null : locale;
};

const handleRemoveOrRequestDeletion = (item: LanguageTableItem) => {
  openActionsLocale.value = null;

  if (hasTranslationContent(item)) {
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
};

const closeBibleTranslationsModal = () => {
  bibleTranslationsModalLocale.value = null;
};

const handleBibleTranslationConfirm = (
  bibleVersion: string,
  bibleVersionName: string,
) => {
  const item = bibleTranslationsModalItem.value;
  if (item) {
    emit('bibleTranslationChange', item, bibleVersion, bibleVersionName);
  }
  closeBibleTranslationsModal();
};
</script>
