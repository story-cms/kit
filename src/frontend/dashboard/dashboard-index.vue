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
              <div class="flex items-center gap-x-4">
                <span class="inline-flex rounded-md shadow-sm isolate">
                  <button
                    type="button"
                    :class="[
                      'relative inline-flex items-center rounded-l-md border-r px-4 py-2 text-sm font-medium leading-4 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 disabled:cursor-not-allowed',
                      activeFilter === 'todo'
                        ? 'bg-indigo-50 text-indigo-700 ring-indigo-700'
                        : 'bg-white text-gray-900',
                    ]"
                    @click="filter('todo')"
                  >
                    To do
                    <span
                      class="inline-flex items-center px-2 py-1 ml-1 text-xs font-medium leading-4 text-indigo-700 bg-gray-100 rounded-full"
                      >{{ todoCount }}</span
                    >
                  </button>

                  <button
                    type="button"
                    :class="[
                      'relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium leading-4 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10',
                      activeFilter === 'all'
                        ? 'bg-indigo-50 text-indigo-700 ring-indigo-700'
                        : 'bg-white text-gray-900',
                    ]"
                    @click="filter('all')"
                  >
                    All
                    <span
                      class="inline-flex items-center px-2 py-1 ml-4 text-xs font-medium leading-4 text-gray-700 bg-gray-100 rounded-full"
                      >{{ allCount }}</span
                    >
                  </button>
                </span>
              </div>
            </div>

            <div class="flex gap-x-4">
              <div class="flex items-center text-sm font-medium leading-4 gap-x-2">
                <span class="bg-green-500 rounded-full size-4"></span>Human
              </div>
              <div class="flex items-center text-sm font-medium leading-4 gap-x-2">
                <span class="bg-blue-500 rounded-full size-4"></span>AI
              </div>
            </div>
          </div>
        </template>
      </ContentHeader>
    </template>
    <div class="flex flex-wrap gap-8">
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
import ContentStats from './content-stats.vue';
import LanguageBlock from './language-block.vue';
import { ref, computed, onMounted } from 'vue';
import axios, { AxiosError } from 'axios';

import { SharedPageProps, DashboardProps, Stats } from '../../types';
import { useSharedStore } from '../store';

const props = defineProps<DashboardProps & SharedPageProps>();

const shared = useSharedStore();

shared.setFromProps(props);

const activeFilter = ref<'todo' | 'all'>('todo');

const todoCount = computed(() => {
  return props.translationProgress.filter((progress) => {
    return !progress.progress.every((stat) => stat.done === stat.total);
  }).length;
});

const allCount = computed(() => {
  return props.translationProgress.length;
});

const filteredProgress = computed(() => {
  if (activeFilter.value === 'all') {
    return props.translationProgress;
  }
  return props.translationProgress.filter((progress) => {
    return !progress.progress.every((stat) => stat.done === stat.total);
  });
});

const filter = (value: 'todo' | 'all') => {
  activeFilter.value = value;
};

const stats = ref<Stats[]>([]);

const processData = (data: any) => {
  const stats: Stats[] = [];

  // Process each metric
  for (const [key, value] of Object.entries(data)) {
    const typedValue = value as { current: number; previous: number };
    const current = typedValue.current;
    const previous = typedValue.previous;
    const change = current - previous;
    const changeType = change >= 0 ? 'increase' : 'decrease';

    // Format the name to be more readable
    const name = key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();

    stats.push({
      name,
      stat: current.toString(),
      previousStat: previous.toString(),
      change: Math.abs(change).toString(),
      changeType,
    });
  }

  return stats;
};

onMounted(() => {
  axios
    .get('/api/v1/analytics')
    .then((response: { data: Stats[] }) => {
      if (response.data.length > 0) {
        stats.value = response.data;
      }
      stats.value = processData(response.data);
    })
    .catch((error: AxiosError) => {
      console.error(error);
    });
});
</script>
