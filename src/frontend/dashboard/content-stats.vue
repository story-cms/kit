<template>
  <div class="px-3 pt-[30px]">
    <h3 class="font-['Inter'] text-2xl font-semibold leading-8 text-gray-800">
      Analytics
    </h3>
    <dl
      v-if="stats.length > 0"
      class="mt-5 grid grid-cols-1 gap-x-5 divide-gray-200 overflow-hidden rounded-lg md:grid-cols-3"
    >
      <div v-for="item in stats" :key="item.name" class="bg-white py-5 sm:p-6">
        <dt class="text-base font-normal text-gray-900">{{ item.name }}</dt>
        <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
          <div class="flex items-baseline text-2xl font-semibold leading-8 text-gray-900">
            {{ item.stat }}
            <span class="ml-2 text-sm font-medium text-gray-500"
              >from {{ item.previousStat }}</span
            >
          </div>

          <div
            :class="[
              item.changeType === 'increase'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800',
              'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0',
            ]"
          >
            <Icon
              v-if="item.changeType === 'increase'"
              name="arrow-up"
              class="-ml-1 mr-0.5 size-3 shrink-0 self-center text-green-500"
            />
            <Icon
              v-else
              name="arrow-up"
              class="-ml-1 mr-0.5 size-3 shrink-0 rotate-180 self-center text-red-500"
            />

            <span class="sr-only">
              {{ item.changeType === 'increase' ? 'Increased' : 'Decreased' }} by
            </span>
            {{ item.change }}
          </div>
        </dd>
      </div>
    </dl>
    <!-- Loading skeleton -->
    <dl
      v-else
      class="mt-5 grid grid-cols-1 gap-x-5 divide-gray-200 overflow-hidden rounded-lg md:grid-cols-3"
    >
      <div v-for="i in 3" :key="i" class="bg-white py-5 sm:p-6">
        <div class="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
        <div class="mt-4 flex items-baseline justify-between md:block lg:flex">
          <div class="flex items-baseline">
            <div class="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
            <div class="ml-2 h-4 w-20 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div
            class="mt-2 h-6 w-20 animate-pulse rounded-full bg-gray-200 md:mt-2 lg:mt-0"
          ></div>
        </div>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import Icon from '../shared/icon.vue';
import { Stats } from '../../types';
defineProps<{
  stats: Stats[];
}>();
</script>
