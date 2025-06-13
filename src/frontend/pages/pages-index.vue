<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Pages">
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
        <template #extra-actions>
          <div class="flex items-center justify-between">
            <IndexFilter :tabs="tabs" :current-tab="currentTab" @change="onFilter" />
            <div class="space-x-6"></div>
          </div>
        </template>
      </ContentHeader>
    </template>
    <div class="my-8 flex flex-col space-y-8">
      <div v-for="page in filteredItems" :key="page.id" @drop="onDrop">
        <PageIndexItem
          :page="page"
          @remove-divider="deleteDivider(page.id)"
          @tap="onTap"
          @drag-start="fromIndex = items.indexOf(page)"
          @drag-enter="toIndex = items.indexOf(page)"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue';
import { router } from '@inertiajs/vue3';
import type { TabItem, PageItem, SharedPageProps, PageIndexProps } from '../../types';
import { usePagesStore, useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import IndexFilter from '../shared/index-filter.vue';
import Icon from '../shared/icon.vue';
import { debounce } from '../shared/helpers';
import ContentHeader from '../shared/content-header.vue';
import PageIndexItem from './page-index-item.vue';

const props = defineProps<PageIndexProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const pageStore = usePagesStore();
const { pages } = toRefs(props);
pageStore.setItems([...pages.value]);
const items = ref<PageItem[]>([...pages.value]);
const fromIndex = ref();
const toIndex = ref();

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

const onDrop = () => {
  swapListItems(items.value, fromIndex.value, toIndex.value);
  pageStore.setItems(items.value);
  fromIndex.value = null;
  toIndex.value = null;
};

const swapListItems = (items: any[], fromIndex: number, toIndex: number) => {
  const element = items[fromIndex];
  items.splice(fromIndex, 1);
  items.splice(toIndex, 0, element);
};

type postType = {
  items: any[];
};

const getPayload = (): postType => {
  return {
    items: items.value,
  };
};

const save = debounce(1000, () => {
  router.post(`/${shared.locale}/page/sort`, getPayload(), {
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
