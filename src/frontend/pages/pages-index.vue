<template>
  <AppLayout title="Pages">
    <template #actions>
      <div class="flex items-center gap-x-6">
        <button
          v-if="isShowingPublished"
          type="button"
          class="rounded-full bg-blue-500 p-2 shadow-md hover:bg-blue-700"
          @click="addDivider"
        >
          <Icon name="divider" class="text-white" />
        </button>
        <button
          type="button"
          class="rounded-full bg-blue-500 p-2 shadow-md hover:bg-blue-700"
          @click="addPage"
        >
          <Icon name="plus" class="text-white" />
        </button>
      </div>
    </template>
    <template #controls>
      <div class="flex items-center justify-between">
        <IndexFilter :tabs="tabs" :current-tab="currentTab" @change="onFilter" />
        <div class="space-x-6"></div>
      </div>
    </template>
    <template #main>
      <div class="my-8 flex flex-col space-y-4">
        <div
          class="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white"
        >
          <PageIndexItem
            v-for="page in filteredItems"
            :key="page.id"
            :page="page"
            :is-dragging="draggingPageId === page.id"
            @remove-divider="deleteDivider(page.id)"
            @tap="onTap"
            @dragstart="onDragStart(page)"
            @dragover="onDragOver(page)"
            @drop="onDragEnd"
            @dragend="onDragEnd"
          />
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue';
import { router } from '@inertiajs/vue3';
import type { RequestPayload } from '@inertiajs/core';
import type { TabItem, PageItem, SharedPageProps, PageIndexProps } from '../../types';
import { usePagesStore, useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import IndexFilter from '../shared/index-filter.vue';
import Icon from '../shared/icon.vue';
import { debounce } from '../shared/helpers';
import PageIndexItem from './page-index-item.vue';

const props = defineProps<PageIndexProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const pageStore = usePagesStore();
const { pages } = toRefs(props);
pageStore.setItems([...pages.value]);
const items = ref<PageItem[]>([...pages.value]);
const draggingPageId = ref<number | null>(null);

// filtering
const currentTab = ref('Published');
const tabs = computed(() => {
  const sansDividers = items.value.filter((item) => item.isDivider !== true);
  const publishedCount = sansDividers.reduce(
    (carry, item) => (item.isPublished ? carry + 1 : carry),
    0,
  );
  return [
    { label: 'Published', count: publishedCount },
    { label: 'Unpublished', count: sansDividers.length - publishedCount },
  ] as TabItem[];
});

const onFilter = (tab: string) => {
  currentTab.value = tab;
};

const filteredItems = computed(() => {
  if (isShowingPublished.value) {
    return items.value.filter((item) => item.isPublished || item.isDivider);
  }
  return items.value.filter((item) => !item.isPublished);
});

const isShowingPublished = computed(() => currentTab.value === 'Published');

const onTap = (id: number) => {
  router.visit(`/${shared.locale}/page/${id}/edit`);
};

const moveItem = (fromIndex: number, toIndex: number) => {
  if (fromIndex === toIndex) return;

  const list = [...items.value];
  const [moved] = list.splice(fromIndex, 1);
  if (!moved) return;
  list.splice(toIndex, 0, moved);
  items.value = list;
  pageStore.setItems(list);
};

const onDragStart = (page: PageItem) => {
  if (!isShowingPublished.value) return;
  draggingPageId.value = page.id;
};

const onDragOver = (page: PageItem) => {
  if (!isShowingPublished.value) return;
  if (draggingPageId.value === null) return;

  const fromIndex = items.value.findIndex((item) => item.id === draggingPageId.value);
  const toIndex = items.value.indexOf(page);
  if (fromIndex === -1 || toIndex === -1) return;
  if (fromIndex === toIndex) return;

  moveItem(fromIndex, toIndex);
};

const onDragEnd = () => {
  draggingPageId.value = null;
};

type postType = {
  items: PageItem[];
};

const getPayload = (): postType => {
  return {
    items: items.value,
  };
};

const save = debounce(1000, () => {
  router.post(`/${shared.locale}/page/sort`, getPayload() as unknown as RequestPayload, {
    onSuccess: (result) => {
      console.log('! saved', result.props);
    },
    onError: (errors) => {
      console.log('! error on save', errors);
    },
  });
});

pageStore.$subscribe(() => {
  items.value = [...pageStore.items];
  save();
});

const addDivider = () => {
  pageStore.addDivider();
};

const deleteDivider = (id: number) => {
  pageStore.deleteDivider(id);
};

const addPage = () => {
  router.visit(`/${shared.locale}/page/create`);
};
</script>
