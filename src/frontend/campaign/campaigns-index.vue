<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Campaigns">
        <template #actions>
          <div class="flex items-center gap-x-6">
            <button
              type="button"
              class="rounded-full bg-blue-500 p-2 shadow-md hover:bg-blue-700"
              @click="addCampaign"
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
    <div class="my-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="item in filteredItems" :key="item.id">
        <a :href="`/${shared.locale}/campaign/${item.id}/edit`">
          <CampaignIndexItem :campaign="item" />
        </a>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import type {
  TabItem,
  CampaignItem,
  SharedPageProps,
  CampaignIndexProps,
} from '../../types';
import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import IndexFilter from '../shared/index-filter.vue';
import Icon from '../shared/icon.vue';

import ContentHeader from '../shared/content-header.vue';
import CampaignIndexItem from './campaign-index-item.vue';

const props = defineProps<CampaignIndexProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const items = ref<CampaignItem[]>([...props.campaigns]);

// filtering
const currentTab = ref('Published');
const tabs = computed(() => {
  const publishedCount = items.value.reduce(
    (carry, item: CampaignItem) => (item.isPublished ? carry + 1 : carry),
    0,
  );
  return [
    { label: 'Published', count: publishedCount },
    { label: 'Unpublished', count: items.value.length - publishedCount },
  ] as TabItem[];
});

const onFilter = (tab: string) => {
  currentTab.value = tab;
};

const filteredItems = computed(() => {
  if (isShowingPublished.value) {
    return items.value.filter((item) => item.isPublished);
  }

  return items.value.filter((item) => !item.isPublished);
});

const isShowingPublished = computed(() => currentTab.value === 'Published');

const addCampaign = () => {
  router.visit(`/${shared.locale}/campaign/create`);
};
</script>
