<template>
  <div class="bg-white">
    <div class="flex justify-between gap-x-4 pb-6 pl-2">
      <ul class="flex flex-row flex-wrap items-center gap-[10px] py-[9px]">
        <li v-for="letter in letters" :key="letter">
          <button
            type="button"
            class="text-sm leading-5 tracking-[133%] text-gray-500"
            @click="letterFilter = letter"
          >
            {{ letter }}
          </button>
        </li>
      </ul>
      <div class="grid grid-cols-1">
        <input
          id="search"
          v-model="searchFilter"
          type="text"
          name="search"
          class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6"
          placeholder="Search"
        />
        <Icon
          name="search"
          class="pointer-events-none col-start-1 row-start-1 ml-4 size-4 self-center text-gray-400"
        />
      </div>
    </div>

    <div
      class="grid grid-cols-1 gap-x-[30px] gap-y-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      <LanguageListItem
        v-for="item in filteredItems"
        :key="item.language.locale"
        :language="item.language"
        :is-selected="item.isSelected"
        :is-added="item.isAdded"
        class="w-full"
      />
    </div>
    <div v-if="filteredItems.length === 0" class="mt-10 flex justify-center">
      <div class="flex max-w-[600px] flex-col items-center justify-center">
        <svg
          width="54"
          height="54"
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.5122 20.25C19.7477 17.6283 23.0815 15.75 27.0001 15.75C31.9707 15.75 36.0001 18.7721 36.0001 22.5C36.0001 25.6487 33.1255 28.2939 29.2371 29.0398C28.0167 29.274 27.0001 30.2574 27.0001 31.5M27 38.25H27.0225M47.25 27C47.25 38.1838 38.1838 47.25 27 47.25C15.8162 47.25 6.75 38.1838 6.75 27C6.75 15.8162 15.8162 6.75 27 6.75C38.1838 6.75 47.25 15.8162 47.25 27Z"
            stroke="#9CA3AF"
            stroke-width="5.49609"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p class="pt-3 text-center text-xl font-semibold leading-8 text-black">
          Don’t see the language you’re looking for?
        </p>
        <p class="pt-8 text-center text-lg font-normal leading-8 text-black">
          You’re going to the ends of the earth! We couldn’t find that language in our
          system...yet. If you’d like us to add it, please contact us.
        </p>
        <button
          class="my-8 rounded-[38px] border bg-blue-500 px-[15px] py-[9px] text-sm/5 font-medium text-white shadow hover:bg-blue-400 focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset]"
        >
          Request Language
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { LanguageSpecification } from '../../../types';
import LanguageListItem from './components/language-list-item.vue';
import Icon from '../../shared/icon.vue';

const props = defineProps<{
  items: LanguageListItemProps[];
}>();

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const letterFilter = ref('');

const searchFilter = ref('');

watch(searchFilter, (value) => {
  if (value) letterFilter.value = '';
});

watch(letterFilter, (value) => {
  if (value) searchFilter.value = '';
});

const filteredItems = computed(() => {
  let items = props.items;
  if (letterFilter.value) {
    items = items.filter((item: LanguageListItemProps) => {
      return item.language.language
        .toLowerCase()
        .startsWith(letterFilter.value.toLowerCase());
    });
  }
  if (searchFilter.value) {
    items = items.filter((item: LanguageListItemProps) => {
      return item.language.language
        .toLowerCase()
        .includes(searchFilter.value.toLowerCase());
    });
  }
  return items;
});

export interface LanguageListItemProps {
  language: LanguageSpecification;
  isSelected: boolean;
  isAdded: boolean;
}
</script>
