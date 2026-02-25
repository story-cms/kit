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
              >
                Change Bible translation
              </button>
              <button
                class="w-full px-6 py-2 pb-3 text-left text-sm font-normal leading-5 text-gray-800 hover:bg-gray-100"
              >
                Request language deletion
              </button>
            </div>
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
import type { LanguageTableItem } from '../../../../types';
import MemberRow from './member-row.vue';
import RingBlock from '../../../dashboard/ring-block.vue';
import LangStrip from './language-strip.vue';

const props = withDefaults(
  defineProps<{
    items: LanguageTableItem[];
    itemsPerPage?: number;
  }>(),
  { itemsPerPage: 10 },
);

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

const toggleActions = (locale: string) => {
  openActionsLocale.value = openActionsLocale.value === locale ? null : locale;
};

const truncate = (s: string | null | undefined, max: number) => {
  const text = s ?? '—';
  return text.length > max ? `${text.slice(0, max)}…` : text;
};
</script>
