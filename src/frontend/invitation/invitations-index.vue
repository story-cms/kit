<template>
  <AppLayout title="Invitations">
<template #actions>
          <div class="flex items-center gap-x-6">
            <button
              type="button"
              class="rounded-full bg-blue-500 p-2 shadow-md hover:bg-blue-700"
              @click="addInvitation"
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
    <div class="my-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="item in filteredItems" :key="item.id">
            <a :href="`/${shared.locale}/invitation/${item.id}/edit`">
              <InvitationIndexItem :invitation="item" />
            </a>
          </div>
        </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import type {
  TabItem,
  InvitationItem,
  SharedPageProps,
  InvitationIndexProps,
} from '../../types';
import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import IndexFilter from '../shared/index-filter.vue';
import Icon from '../shared/icon.vue';

import InvitationIndexItem from './invitation-index-item.vue';

const props = defineProps<InvitationIndexProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const items = ref<InvitationItem[]>([...props.invitations]);

// filtering
const currentTab = ref('Published');
const tabs = computed(() => {
  const publishedCount = items.value.reduce(
    (carry, item: InvitationItem) => (item.isPublished ? carry + 1 : carry),
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

const addInvitation = () => {
  router.visit(`/${shared.locale}/invitation/create`);
};
</script>
