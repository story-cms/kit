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
        class="mb-7 flex flex-col justify-between gap-y-4 md:flex-row md:items-center md:gap-x-4"
      >
        <div class="flex gap-x-4 px-3">
          <IndexFilter
            :tabs="[
              { label: 'To do', count: todoCount },
              { label: 'All', count: allCount },
            ]"
            :current-tab="activeFilter"
            @change="filter"
          />
        </div>

        <div class="flex gap-x-6">
          <div class="flex items-center justify-center gap-x-2">
            <Icon name="pie-chart" class="size-5 text-green-500" />
            <span class="text-sm font-medium leading-4">Human</span>
          </div>
          <div class="flex items-center justify-center gap-x-2">
            <Icon name="pie-chart" class="size-5 text-blue-500" />
            <span class="text-sm font-medium leading-4">AI</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isMultiLingual" class="flex flex-wrap gap-8">
      <LanguageBlock
        v-for="progress in filteredProgress"
        :key="progress.language"
        :progress="progress"
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
import Icon from '../shared/icon.vue';
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
      // check if response is an object
      if (typeof response.data === 'object') {
        stats.value = response.data;
      } else {
        stats.value = [];
      }
      isLoading.value = false;
    })
    .catch((error) => {
      error.value = error.response?.data.message;
      isLoading.value = false;
    });
});
</script>
