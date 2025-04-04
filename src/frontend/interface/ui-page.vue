<template>
  <AppLayout>
    <div class="container px-3 mx-auto">
      <h3 class="font-['Inter'] text-2xl font-semibold text-gray-800 mt-6">
        Interface: {{ language.language }}
      </h3>
      <ui-toolbar
        v-model="searchTerm"
        :to-do-count="todoCount"
        :all-count="props.items.length"
        :active-filter="activeFilter"
        :sort-by="sortBy"
        @update:active-filter="activeFilter = $event"
        @sort="handleSort"
      ></ui-toolbar>
    </div>

    <section class="container px-3 mx-auto mt-5">
      <div class="grid grid-cols-[24fr_76fr] gap-x-6 h-[calc(100vh-12rem)]">
        <div class="overflow-y-auto scrollbar-hide">
          <div v-if="filteredItems.length" class="sticky top-0 bg-gray-50">
            <button
              v-show="todoCount"
              @click="translateItems"
              type="button"
              class="flex items-center justify-center gap-x-2 rounded-full py-[11px] text-sm font-medium text-gray-800 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ring-1 ring-inset ring-gray-300 w-full leading-4 mb-4"
              :class="{
                'bg-blue-50': isTranslating,
                'bg-white': !isTranslating,
              }"
            >
              <Icon class="w-auto text-gray-800" name="sparkles" />
              <span>
                {{
                  isTranslating
                    ? 'Translation in progress...'
                    : 'AI translate to do items'
                }}
              </span>
            </button>
          </div>
          <UiStringItem
            v-show="filteredItems.length"
            v-for="item in filteredItems"
            :key="item.key"
            :item="item"
            :is-selected="selectedItem?.key === item.key"
            @click="selectItem(item)"
          />
        </div>
        <div>
          <template v-if="filteredItems.length">
            <form v-show="!isTranslating">
              <UiCard
                v-if="selectedItem"
                :key="selectedItem.key"
                v-model:model="model[selectedItem.key]"
                :item="selectedItem"
                :error="errors[selectedItem.key]"
                @flagged="handleFlagged"
              />
            </form>
            <div v-show="isTranslating" class="grid w-full h-full place-content-center">
              <p>Loading...</p>
            </div>
          </template>
          <div v-else class="py-10 text-gray-500">
            <p class="text-sm text-center">No results found for "{{ searchTerm }}"</p>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import axios from 'axios';
import { router } from '@inertiajs/vue3';

import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import { ResponseStatus } from '../../types';
import type { UiItem, UiPageProps, SharedPageProps } from '../../types';
import Icon from '../shared/icon.vue';
import uiToolbar from './components/ui-toolbar.vue';
import UiStringItem from './components/ui-string-item.vue';
import UiCard from './components/ui-card.vue';

type ModelType = { [key: string]: string | undefined };

const props = defineProps<SharedPageProps & UiPageProps>();

const searchTerm = ref('');

const todoCount = computed(() => {
  return props.items.filter((item) => !item.translation).length;
});

const activeFilter = ref<'todo' | 'all'>('all');
const sortBy = ref<{ field: 'status' | 'lastEdited' | null; direction: 'asc' | 'desc' }>({
  field: null,
  direction: 'asc',
});

const filteredItems = computed(() => {
  let items = props.items;

  if (activeFilter.value === 'todo') {
    items = items.filter((item) => !item.translation);
  }

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    items = items.filter(
      (item) =>
        item.source.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.key.toLowerCase().includes(search),
    );
  }

  const untranslatedItems = items.filter((item) => !item.translation);
  const translatedItems = items.filter((item) => !!item.translation);

  const sortByFlagged = (a: UiItem, b: UiItem) => {
    // First sort by recheck flag
    if (a.flag === 'recheck' && b.flag !== 'recheck') return -1;
    if (a.flag !== 'recheck' && b.flag === 'recheck') return 1;

    // Then sort by prefilled flag
    if (a.flag === 'prefilled' && b.flag !== 'prefilled') return -1;
    if (a.flag !== 'prefilled' && b.flag === 'prefilled') return 1;

    // If both have the same flag or both are null, maintain original order
    return 0;
  };

  const sortByStatus = (a: UiItem, b: UiItem) => {
    // First sort by translation status
    const aTranslated = !!a.translation;
    const bTranslated = !!b.translation;
    if (aTranslated !== bTranslated) {
      return sortBy.value.direction === 'asc'
        ? aTranslated
          ? 1
          : -1
        : aTranslated
        ? -1
        : 1;
    }

    // If both have the same translation status, sort by flag
    const aFlag = a.flag || '';
    const bFlag = b.flag || '';
    return sortBy.value.direction === 'asc'
      ? aFlag.localeCompare(bFlag)
      : bFlag.localeCompare(aFlag);
  };

  const sortByLastEdited = (a: UiItem, b: UiItem) => {
    const aDate = a.updatedAt || '';
    const bDate = b.updatedAt || '';
    return sortBy.value.direction === 'asc'
      ? new Date(aDate).getTime() - new Date(bDate).getTime()
      : new Date(bDate).getTime() - new Date(aDate).getTime();
  };

  const sortFunction =
    sortBy.value.field === 'status'
      ? sortByStatus
      : sortBy.value.field === 'lastEdited'
      ? sortByLastEdited
      : sortByFlagged;

  return [...untranslatedItems.sort(sortFunction), ...translatedItems.sort(sortFunction)];
});

const shared = useSharedStore();
shared.setFromProps(props);

const listToMap = (list: UiItem[]): ModelType => {
  const map: ModelType = {};
  for (const item of list) {
    const key = item.key;
    map[key] = item.translation;
  }
  return map;
};

const startValues = listToMap(props.items);
const model = reactive(startValues);

const selectedItem = ref<UiItem | null>(null);

watch(
  [filteredItems],
  () => {
    if (
      filteredItems.value.length &&
      (!selectedItem.value ||
        !filteredItems.value.some((item) => item.key === selectedItem.value?.key))
    ) {
      selectedItem.value = filteredItems.value[0];
    }
  },
  { immediate: true },
);

const selectItem = (item: UiItem) => {
  selectedItem.value = item;
};

const isTranslating = ref(false);

const translateItems = async () => {
  if (isTranslating.value) return;

  isTranslating.value = true;
  const itemsToTranslate = props.items.filter((item) => !item.translation);

  const payload = itemsToTranslate.reduce((acc, item) => {
    acc[item.key] = '';
    return acc;
  }, {} as Record<string, string>);
  try {
    const response = await axios.post('/ui/translate-bulk', payload);

    if (response.status === 200) {
      router.reload({ only: ['ui', 'items'] });
      shared.addMessage(ResponseStatus.Accomplishment, 'Items translated successfully');
    }
  } catch (error) {
    shared.addMessage(ResponseStatus.Failure, 'Failed to translate items');
  } finally {
    isTranslating.value = false;
  }
};

const handleFlagged = (key: string) => {
  const currentIndex = filteredItems.value.findIndex((item) => item.key === key);
  if (currentIndex !== -1 && currentIndex < filteredItems.value.length - 1) {
    selectedItem.value = filteredItems.value[currentIndex + 1];
  }
};

const handleSort = (field: 'status' | 'lastEdited') => {
  if (sortBy.value.field === field) {
    sortBy.value.direction = sortBy.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value.field = field;
    sortBy.value.direction = 'asc';
  }
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari and Opera */
}
</style>
