<template>
  <section>
    <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table class="w-full min-w-[720px] table-auto">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr>
            <th
              scope="col"
              class="max-w-[400px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Active translations
            </th>
            <th
              scope="col"
              class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Translation progress
            </th>
            <th
              scope="col"
              class="max-w-[400px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Team members
            </th>
            <th
              scope="col"
              class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Bible translation
            </th>
            <th
              scope="col"
              class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <LanguageTableRow
            v-for="row in displayRows"
            :key="row.item.locale"
            :item="row.item"
            :is-source="row.isSource"
            :deletion-mode="row.deletionMode"
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
  </section>
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

const handleRemoveOrRequestDeletion = (item: LanguageTableItem) => {
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
