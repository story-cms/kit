<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Language translation">
        <template #hero>
          <WelcomeBanner />
          <ContentStats :stats="stats" />
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

            <div class="flex gap-x-4">
              <button
                class="flex items-center text-sm font-medium leading-4 gap-x-2"
                @click="toggle"
              >
                <span class="bg-green-500 rounded-full size-4"></span>Human
              </button>
              <button class="flex items-center text-sm font-medium leading-4 gap-x-2">
                <span class="bg-blue-500 rounded-full size-4"></span>AI
              </button>
            </div>
          </div>
        </template>
      </ContentHeader>
    </template>
    <div class="flex flex-wrap gap-8">
      <LanguageBlock
        :progress="[
          {
            name: 'Interface',
            done: 100,
            draft: 0,
            total: 100,
          },
          {
            name: 'Content',
            done: 48,
            draft: 0,
            total: 48,
          },
        ]"
        language="German"
        locale="DE"
        lastUpdate="2025-05-20"
      />
      <LanguageBlock
        :progress="[
          {
            name: 'Interface',
            done: 75,
            draft: 0,
            total: 100,
          },
          {
            name: 'Content',
            done: 48,
            draft: 0,
            total: 48,
          },
        ]"
        language="German"
        locale="DE"
        last-update="2025-05-20"
      />
      <LanguageBlock
        :progress="[
          {
            name: 'Interface',
            done: 60,
            draft: 10,
            total: 100,
          },
          {
            name: 'Content',
            done: 48,
            draft: 0,
            total: 48,
          },
        ]"
        language="German"
        locale="DE"
        last-update="2025-05-20"
      />
      <LanguageBlock
        :progress="[
          {
            name: 'Interface',
            done: 60,
            draft: 10,
            total: 100,
          },
          {
            name: 'Content',
            done: 48,
            draft: 0,
            total: 48,
          },
        ]"
        language="German"
        locale="DE"
        last-update="2025-05-20"
      />
      <LanguageBlock
        :progress="[
          {
            name: 'Interface',
            done: 60,
            draft: 10,
            total: 100,
          },
          {
            name: 'Content',
            done: 48,
            draft: 0,
            total: 48,
          },
        ]"
        language="German"
        locale="DE"
        last-update="2025-05-20"
      />
      <LanguageBlock
        :progress="[
          {
            name: 'Interface',
            done: 60,
            draft: 10,
            total: 100,
          },
          {
            name: 'Content',
            done: 48,
            draft: 0,
            total: 48,
          },
        ]"
        language="German"
        locale="DE"
        lastUpdate="2025-05-20"
      />
    </div>
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
import WelcomeBanner from './welcome-banner.vue';
import ContentStats from './content-stats.vue';
import LanguageBlock from './language-block.vue';
import { computed, ref } from 'vue';

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
