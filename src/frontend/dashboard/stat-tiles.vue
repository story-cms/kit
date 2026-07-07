<template>
  <div class="pt-[30px]">
    <h3
      class="text-xl font-semibold leading-7 tracking-[-0.45px] text-[#182E33] [&>span]:text-gray-400"
    >
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
