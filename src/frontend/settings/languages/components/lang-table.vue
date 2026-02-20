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
        <tr v-for="item in paginatedItems" :key="item.locale">
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
            {{ item.activeTranslations ?? '—' }}
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
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
            {{ item.bibleTranslation ?? '—' }}
          </td>
          <td class="relative py-4 pl-3 pr-4 text-right sm:pr-6">
            <button
              type="button"
              class="cursor-pointer text-gray-400 hover:text-gray-600"
              @click="emit('actions', item)"
            >
              <Icon name="dots-vertical" class="size-5" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

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
import Icon from '../../../shared/icon.vue';
import Pagination from '../../../shared/pagination.vue';
import type { LanguageSpecification, UserInterface, Progress } from '../../../../types';
import MemberRow from './member-row.vue';
import RingBlock from '../../../dashboard/ring-block.vue';

export interface TableItem extends LanguageSpecification {
  activeTranslations?: number;
  translationProgress?: Omit<Progress, 'lastUpdated'>[];
  teamMembers?: UserInterface[];
  bibleTranslation?: string;
}

const props = withDefaults(
  defineProps<{
    items: TableItem[];
    itemsPerPage?: number;
  }>(),
  { itemsPerPage: 10 },
);

const emit = defineEmits<{
  (e: 'actions', item: TableItem): void;
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
</script>
