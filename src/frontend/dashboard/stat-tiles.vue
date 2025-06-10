<template>
  <div class="px-3 pt-[30px]">
    <h3 class="font-['Inter'] text-2xl font-semibold leading-8 text-gray-800">
      Analytics
    </h3>
    <div>
      <div v-if="error" class="text-red-500">
        {{ error }}
      </div>
      <div v-else class="mt-5 flex flex-col gap-5 lg:flex-row">
        <template v-if="!isLoading">
          <StatTile v-for="stat in stats" :key="stat.name" :metric="stat" />
        </template>
        <template v-else>
          <div v-for="i in 3" :key="i" class="w-full bg-white p-6">
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
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StatMetric } from '../../types';
import StatTile from './stat-tile.vue';

defineProps<{
  stats: StatMetric[];
  error: string | null;
  isLoading: boolean;
}>();
</script>
