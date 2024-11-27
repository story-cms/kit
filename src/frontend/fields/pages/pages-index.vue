<template>
  <AppLayout>
    <div class="container px-6 py-3 mx-auto lg:w-2/3">
      <div class="flex items-center justify-between">
        <div class="space-x-6">
          <AddItemButton label="Page" @add="addPage" />
          <AddItemButton v-if="isShowingPublished" label="Divider" @add="addDivider" />
        </div>
        <IndexFilter :tabs="tabs" :current-tab="currentTab" @change="onFilter" />
      </div>
      <div class="flex flex-col my-8 space-y-8">
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
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue';
import { usePagesStore, useSharedStore } from '../../store';
import AppLayout from '../../shared/app-layout.vue';
import AddItemButton from '../../shared/add-item-button.vue';
import PageIndexItem from './page-index-item.vue';
import { router } from '@inertiajs/vue3';
import { debounce } from '../../shared/helpers';
import IndexFilter from '../../shared/index-filter.vue';
import type { TabItem, PageItem, SharedPageProps, PageIndexProps } from '../../../types';

const props = defineProps<PageIndexProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);

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
  router.visit(`/page/${id}/edit`);
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
  router.post('/page/sort', getPayload(), {
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
  router.visit('/page/create');
};
</script>
