<template>
  <AppLayout title="Dashboard" :subtitle="greeting">
    <template #actions>
      <div class="flex flex-wrap gap-4">
        <Link
          :href="`/${shared.locale}/page/create`"
          class="flex items-center gap-x-2 rounded-full bg-blue-50 px-3 py-[9px] text-sm font-medium leading-4 text-blue-700 shadow-[0px_1px_2px_0px_#0000000D] hover:bg-blue-100"
        >
          <Icon name="document-add" />
          New Page
        </Link>
        <Link
          v-if="shared.user.isAdmin"
          :href="`/${shared.locale}/user`"
          class="flex items-center gap-x-2 rounded-full bg-blue-50 px-3 py-[9px] text-sm font-medium leading-4 text-blue-700 shadow-[0px_1px_2px_0px_#0000000D] hover:bg-blue-100"
        >
          <Icon name="user-add" />
          New User
        </Link>
        <a
          v-if="shared.config.helpUrl"
          class="flex items-center gap-x-2 rounded-full bg-blue-50 px-3 py-[9px] text-sm font-medium leading-4 text-blue-700 shadow-[0px_1px_2px_0px_#0000000D] hover:bg-blue-100"
          :href="shared.config.helpUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="question-mark-circle" />
          Get Support
        </a>
      </div>
    </template>
    <template #main>
      <div>
        <StatTiles :stats="stats" :is-loading="isLoading" :error="error" />
      </div>
      <div>
        <div>
          <div class="flex items-center justify-between py-10">
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

          <div class="flex gap-x-6">
            <div class="flex items-center justify-center gap-x-2">
              <Icon name="pie-chart" class="size-5 text-green-500" />
              <span class="text-sm font-medium leading-4">Done</span>
            </div>
            <div class="flex items-center justify-center gap-x-2">
              <Icon name="pie-chart" class="size-5 text-blue-500" />
              <span class="text-sm font-medium leading-4">Pending</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="isMultiLingual"
        class="grid grid-cols-[repeat(auto-fit,_minmax(207px,_207px))] justify-center gap-x-[34px] gap-y-[27px]"
        :class="
          filteredProgress.length > 3
            ? 'min-[490px]:justify-between'
            : 'min-[490px]:justify-start'
        "
      >
        <LanguageBlock
          v-for="progress in filteredProgress"
          :key="progress.language"
          :progress="progress"
        />
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../shared/app-layout.vue';
import StatTiles from './stat-tiles.vue';
import IndexFilter from '../shared/index-filter.vue';
import LanguageBlock from './language-block.vue';
import Icon from '../shared/icon.vue';
import { ref, computed, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import axios from 'axios';

import { SharedPageProps, DashboardProps, StatMetric } from '../../types';
import { useSharedStore } from '../store';
import { sortLanguagesByDisplayName } from '../shared/helpers';

const props = defineProps<DashboardProps & SharedPageProps>();

const shared = useSharedStore();

shared.setFromProps(props);

const greeting = computed(() => {
  const firstName = shared.user.name.split(' ')[0];
  return `Hey ${firstName}!`;
});

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
  const items =
    activeFilter.value === 'All'
      ? props.translationProgress
      : props.translationProgress.filter((progress) => {
          return !progress.progress.every((stat) => stat.done === stat.total);
        });
  return sortLanguagesByDisplayName(items);
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
