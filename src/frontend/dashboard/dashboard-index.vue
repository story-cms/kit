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
            class="mb-4 flex flex-col justify-between gap-y-4 md:flex-row md:items-center md:gap-x-4"
          >
            <div class="flex gap-x-4">
              <div class="flex items-center gap-x-4">
                <span class="isolate inline-flex rounded-md shadow-sm">
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
                      class="ml-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium leading-4 text-indigo-700"
                      >{{ shared.uiTodoCount }}</span
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
                      class="ml-4 inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium leading-4 text-gray-700"
                      >{{ allCount }}</span
                    >
                  </button>
                </span>
              </div>
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
        </template>
      </ContentHeader>
    </template>
    <div class="flex flex-wrap gap-8">
      <LanguageBlock
        v-for="progress in translationProgress"
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
import { ref } from 'vue';

import { SharedPageProps, DashboardProps } from '../../types';
import { useSharedStore } from '../store';

const props = defineProps<DashboardProps & SharedPageProps>();

const shared = useSharedStore();

shared.setFromProps(props);

const activeFilter = ref<'todo' | 'all'>('todo');

const filter = (value: 'todo' | 'all') => {
  activeFilter.value = value;
};
</script>
