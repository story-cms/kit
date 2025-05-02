<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="`${meta.storyType}: ${shared.currentStoryName}`">
        <template #standard-actions>
          <icon :name="iconName" class="w-8 h-8 text-black" @click.prevent="toggle" />
        </template>
        <template #extra-actions>
          <div
            class="flex flex-col justify-between mb-4 gap-y-4 md:flex-row md:items-center md:gap-x-4"
          >
            <div class="flex gap-x-4">
              <IndexFilter :tabs="tabs" :current-tab="currentTab" @change="onFilter" />

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

            <div class="grid grid-cols-1">
              <input
                id="search"
                type="text"
                name="search"
                class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6"
                :placeholder="meta.chapterType"
                v-model="filterNumber"
              />
              <svg
                class="self-center col-start-1 row-start-1 ml-4 text-gray-400 pointer-events-none size-4"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2ZM0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6C12 7.29583 11.5892 8.49572 10.8907 9.47653L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L9.47653 10.8907C8.49572 11.5892 7.29583 12 6 12C2.68629 12 0 9.31371 0 6Z"
                  fill="#374151"
                />
              </svg>
            </div>
          </div>
        </template>
      </ContentHeader>
    </template>
    <div
      :class="[
        'grid gap-4',
        {
          'grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))]':
            !isList && filteredIndex.length > 3,
        },
        {
          'grid-cols-[repeat(auto-fit,_minmax(260px,_260px))]':
            !isList && filteredIndex.length <= 3,
        },
        {
          'grid-cols-1': isList,
        },
      ]"
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
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import { computed, ref, onMounted } from 'vue';

import Icon from '../shared/icon.vue';
import AddItemButton from '../shared/add-item-button.vue';
import IndexFilter from '../shared/index-filter.vue';
import IndexCard from '../chapters/index-card.vue';

import { SharedPageProps, DashboardProps, AddStatus, IndexReadyItem } from '../../types';
import { useSharedStore } from '../store';

const props = defineProps<DashboardProps & SharedPageProps>();

const shared = useSharedStore();

shared.setFromProps(props);

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

onMounted(() => {
  shared.setCurrentStoryName(props.storyName);
});
</script>
