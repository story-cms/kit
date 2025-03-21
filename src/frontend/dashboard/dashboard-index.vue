<template>
  <AppLayout>
    <div class="container p-3 mx-auto">
      <div class="flex items-center justify-between my-4">
        <h3 class="text-xl font-semibold">{{ meta.storyType }}: {{ props.storyName }}</h3>
        <icon :name="iconName" class="w-8 h-8 text-black" @click.prevent="toggle" />
      </div>

      <div class="flex items-center justify-between mb-4">
        <div class="flex space-x-6">
          <input
            v-model="filterNumber"
            class="block w-24 px-3 py-1 text-sm font-normal leading-5 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            :placeholder="meta.chapterType"
          />
          <AddItemButton
            v-if="addStatus == AddStatus.Add"
            :label="meta.chapterType"
            @add="addDraft"
          />
          <button
            v-if="addStatus == AddStatus.Wait"
            type="button"
            class="inline-flex items-center rounded-xl bg-indigo-50 px-3 py-[9px] text-sm font-medium leading-4 text-indigo-700 shadow-sm"
            disabled
          >
            {{ `No more ${meta.chapterType}s available to translate` }}
          </button>
        </div>
        <IndexFilter :tabs="tabs" :current-tab="currentTab" @change="onFilter" />
      </div>
      <div
        class="grid grid-cols-1 gap-4"
        :class="{
          ' sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5': !isList,
        }"
      >
        <index-card
          v-for="item in filteredIndex"
          :key="item.number"
          :item="item"
          :is-list="isList"
          placeholder-image="https://res.cloudinary.com/onesheep/image/upload/v1684754051/Screenshot_2023-05-22_at_13.12.03_pnamdt.png"
          :scope="currentTab"
          :chapter-name="meta.chapterType"
          @tap="onTap"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../shared/app-layout.vue';
import { computed, ref } from 'vue';

import Icon from '../shared/icon.vue';
import AddItemButton from '../shared/add-item-button.vue';
import IndexFilter from '../shared/index-filter.vue';
import IndexCard from '../chapters/index-card.vue';

import { SharedPageProps, DashboardProps, AddStatus, IndexReadyItem } from '../../types';
import { useSharedStore } from '../store';

const props = defineProps<DashboardProps & SharedPageProps>();

useSharedStore().setFromProps(props);

const isList = ref(false);
const toggle = () => {
  isList.value = !isList.value;
};

const filterNumber = ref<string | null>(null);
const currentTab = ref('Live');

const addDraft = () => (window.location.href = '/draft/create');

const onFilter = (tab: string) => {
  currentTab.value = tab;
};

const iconName = computed(() => {
  return isList.value ? 'list' : 'grid';
});
const filteredIndex = computed(() => {
  const needle = currentTab.value === 'Live' ? 'Live' : 'Draft';

  return props.index.filter((item) => {
    const hasTag = item.tags.includes(needle);
    if (!filterNumber.value) return hasTag;

    return hasTag && item.number.toString().startsWith(filterNumber.value);
  });
});

const tabs = computed(() => {
  const liveCount = props.index.reduce(
    (carry, item) => (item.tags.includes('Live') ? carry + 1 : carry),
    0,
  );

  const draftCount = props.index.reduce(
    (carry, item) => (item.tags.includes('Draft') ? carry + 1 : carry),
    0,
  );

  return [
    { label: 'Live', count: liveCount },
    { label: 'Drafts', count: draftCount },
  ];
});

const onTap = (item: IndexReadyItem) => {
  if (currentTab.value == 'Drafts') {
    window.location.href = `/draft/${item.number}/edit`;
  } else {
    // window.location.href = `/draft/${item.number}/edit`;
    window.location.href = `/chapter/${item.number}`;
  }
};
</script>
