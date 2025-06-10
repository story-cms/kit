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
        <StatTile
          v-for="stat in stats"
          :key="stat.name"
          :metric="stat"
          :is-loading="isLoading"
        />
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
