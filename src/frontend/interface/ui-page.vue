<template>
  <AppLayout>
    <StickyHeader>
      <div class="container px-3 mx-auto">
        <h3 class="font-['Inter'] text-2xl font-semibold text-gray-800 mt-6">
          Interface: {{ language.language }}
        </h3>
        <ui-toolbar v-model="searchTerm"></ui-toolbar>
      </div>
    </StickyHeader>

    <section class="container px-3 mx-auto mt-5">
      <div class="grid grid-cols-[24fr_76fr] gap-x-6 h-[calc(100vh-12rem)]">
        <div class="overflow-y-auto scrollbar-hide">
          <div class="sticky top-0 bg-gray-50">
            <button
              type="button"
              class="inline-flex items-center justify-center gap-x-2 rounded-full bg-white hover:bg- px-3.5 py-2.5 text-sm font-medium text-gray-800 shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ring-1 ring-inset ring-gray-300 w-full leading-4 mb-4"
            >
              <Icon name="sparkles" class="w-4 h-4 text-gray-800" />

              AI translate to do items
            </button>
          </div>
          <template v-if="filteredItems.length">
            <UiStringItem
              v-for="item in filteredItems"
              :key="item.key"
              :item="item"
              :is-selected="selectedItem?.key === item.key"
              @click="selectItem(item)"
            />
          </template>
          <div v-else class="py-10 text-gray-500">
            <p class="text-sm">No results found for "{{ searchTerm }}"</p>
          </div>
        </div>
        <div>
          <form>
            <UiCard
              v-if="selectedItem"
              :key="selectedItem.key"
              v-model:model="model[selectedItem.key]"
              :item="selectedItem"
              :error="errors[selectedItem.key]"
            />
          </form>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import StickyHeader from '../shared/sticky-header.vue';
import uiToolbar from './components/ui-toolbar.vue';
import UiStringItem from './components/ui-string-item.vue';

import { router } from '@inertiajs/vue3';

import { ResponseStatus } from '../../types';
import type { UiItem, UiPageProps, SharedPageProps } from '../../types';
import UiCard from './components/ui-card.vue';
import Icon from '../shared/icon.vue';

type ModelType = { [key: string]: string | undefined };

const props = defineProps<SharedPageProps & UiPageProps>();

const searchTerm = ref('');

const filteredItems = computed(() => {
  const items = props.items
    .filter((item) => !item.translation)
    .concat(props.items.filter((item) => !!item.translation));

  if (!searchTerm.value) return items;

  const search = searchTerm.value.toLowerCase();
  return items.filter(
    (item) =>
      item.source.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      item.key.toLowerCase().includes(search),
  );
});

const shared = useSharedStore();
shared.setFromProps(props);

const isBusy = ref(false);

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

selectedItem.value = filteredItems.value[0];

const selectItem = (item: UiItem) => {
  selectedItem.value = item;
};

const save = () => {
  isBusy.value = true;
  router.post('/ui', model, {
    preserveScroll: true,
    onSuccess: () => {
      shared.addMessage(ResponseStatus.Accomplishment, 'Translations saved');
    },
    onError: (errors) => {
      shared.addMessage(ResponseStatus.Failure, 'Error saving translations');
    },
    onFinish: () => {
      isBusy.value = false;
    },
  });
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
