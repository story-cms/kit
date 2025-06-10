<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="">
        <template #hero>
          <WelcomeBanner />
        </template>
      </ContentHeader>
    </template>

    <div>
      <StatTiles :stats="stats" :is-loading="isLoading" :error="error" />
    </div>
    <div>
      <div>
        <div class="flex items-center justify-between px-3 py-10">
          <h3
            class="font-['Inter'] text-2xl font-semibold leading-8 text-gray-800 [&>span]:text-gray-400"
          >
            {{ isMultiLingual ? 'Language translation' : '' }}
          </h3>
        </div>
      </div>
      <div
        v-if="isMultiLingual"
        class="mb-4 flex flex-col justify-between gap-y-4 md:flex-row md:items-center md:gap-x-4"
      >
        <div class="flex gap-x-4">
          <IndexFilter
            :tabs="[
              { label: 'To do', count: todoCount },
              { label: 'All', count: allCount },
            ]"
            :current-tab="activeFilter"
            @change="filter"
          />
        </div>

        <div class="flex gap-x-4">
          <div class="flex items-center gap-x-2 text-sm font-medium leading-4">
            <span class="size-4 rounded-full bg-green-500"></span>Human
          </div>
          <div class="flex items-center gap-x-2 text-sm font-medium leading-4">
            <span class="size-4 rounded-full bg-blue-500"></span>AI
          </div>
        </div>
      </div>
    </div>
    <div v-if="isMultiLingual" class="flex flex-wrap gap-8">
      <LanguageBlock
        v-for="progress in filteredProgress"
        :key="progress.language"
        :progress="progress.progress"
        :language="progress.language"
        :locale="progress.locale"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import WelcomeBanner from './welcome-banner.vue';
import StatTiles from './stat-tiles.vue';
import IndexFilter from '../shared/index-filter.vue';
import LanguageBlock from './language-block.vue';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

import { SharedPageProps, DashboardProps, StatMetric } from '../../types';
import { useSharedStore } from '../store';

const props = defineProps<DashboardProps & SharedPageProps>();

const shared = useSharedStore();

shared.setFromProps(props);

const activeFilter = ref<'To do' | 'All'>('To do');

const todoCount = computed(() => {
  return props.translationProgress.filter((progress) => {
    return !progress.progress.every((stat) => stat.done === stat.total);
  }).length;
});

const allCount = computed(() => {
  return props.translationProgress.length;
});

const filteredProgress = computed(() => {
  if (activeFilter.value === 'All') {
    return props.translationProgress;
  }
  return props.translationProgress.filter((progress) => {
    return !progress.progress.every((stat) => stat.done === stat.total);
  });
});

const filter = (value: 'To do' | 'All') => {
  activeFilter.value = value;
};

const isMultiLingual = computed(() => shared.languages.length > 1);

const isLoading = ref(true);
const error = ref<string | null>(null);

const stats = ref<StatMetric[]>([]);

onMounted(() => {
  axios
    .get('/analytics')
    .then((response) => {
      stats.value = response.data;
      isLoading.value = false;
    })
    .catch((error) => {
      error.value = error.response?.data.message;
      isLoading.value = false;
    });
});
</script>
