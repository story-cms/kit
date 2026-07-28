<template>
  <AppLayout title="Dashboard" :subtitle="greeting">
    <template #actions>
      <div class="flex flex-wrap gap-4">
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
      <div class="pt-10">
        <ActionGrid :items="actionItems" @action="handleActionGrid" />
      </div>
      <div>
        <div>
          <div class="flex items-center justify-between py-10">
            <h1>
              {{ isMultiLingual ? 'Translations' : '' }}
            </h1>
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
import ActionGrid, { ActionGridItem } from './action-grid.vue';
import Icon from '../shared/icon.vue';
import { BookOpen, FileText, Languages } from '@lucide/vue';
import { ref, computed, onMounted } from 'vue';
import { Link, router } from '@inertiajs/vue3';
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

const actionItems = computed<ActionGridItem[]>(() => {
  const disabled = !shared.user.isAdmin;

  return [
    {
      url: `/${shared.locale}/settings/languages/edit`,
      icon: Languages,
      title: 'New Language',
      description:
        'Engage your audience morning, noon, and night. Create healthy daily rhythms with content that reaches them throughout the day. ',
      disabled,
    },
    {
      url: `/${shared.locale}/story/create`,
      icon: BookOpen,
      title: 'New Story',
      description:
        'Engage your audience morning, noon, and night. Create healthy daily rhythms with content that reaches them throughout the day. ',
      disabled,
    },
    {
      url: `/${shared.locale}/page/create`,
      icon: FileText,
      title: 'New Page',
      description:
        'Engage your audience morning, noon, and night. Create healthy daily rhythms with content that reaches them throughout the day. ',
      disabled,
    },
  ];
});

const handleActionGrid = (url: string) => {
  router.visit(url);
};

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
