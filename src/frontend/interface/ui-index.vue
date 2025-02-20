<template>
  <AppLayout>
    <StickyHeader>
      <div class="container px-3 mx-auto">
        <div class="flex items-center justify-between py-6">
          <h2 class="text-2xl font-semibold leading-8 text-gray-800">Languages</h2>
          <ul class="flex items-center gap-x-4 font-['Inter']">
            <li class="flex items-center gap-x-4">
              <span class="size-[14px] bg-[#10B981]"></span>
              <span class="text-lg font-medium leading-7 text-gray-500"
                >Human translator</span
              >
            </li>
            <li class="flex items-center gap-x-4">
              <span class="size-[14px] bg-[#3B82F6]"></span>
              <span class="text-lg font-medium leading-7 text-gray-500"
                >AI translation</span
              >
            </li>
          </ul>
        </div>
      </div>
    </StickyHeader>
    <section class="container px-3 mx-auto">
      <ul v-if="props.progress.length > 0" class="grid grid-cols-2 gap-4">
        <li v-for="item in props.progress" :key="item.locale">
          <UiIndexCard v-bind="item" />
        </li>
      </ul>
      <div v-else class="flex items-center justify-center py-12">
        <p class="text-lg font-medium leading-7 text-gray-500">
          No progress on translations yet
        </p>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../shared/app-layout.vue';
import { useSharedStore } from '../store';
import type { UiIndexProps, SharedPageProps } from '../../types';
import StickyHeader from '../shared/sticky-header.vue';

import UiIndexCard from './components/ui-index-card.vue';

const props = defineProps<SharedPageProps & UiIndexProps>();

const shared = useSharedStore();
shared.setFromProps(props);
</script>
