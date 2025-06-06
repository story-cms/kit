<template>
  <div class="px-3 pt-[30px]">
    <h3 class="font-['Inter'] text-2xl font-semibold leading-8 text-gray-800">
      Analytics
    </h3>
    <div class="flex flex-col gap-5 mt-5 lg:flex-row">
      <StatsTile v-for="metric in metrics" :key="metric.name" :metric="metric" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { StatMetric } from '../../types';
import StatsTile from './stats-tile.vue';
defineProps<{
  metrics: StatMetric[];
}>();
</script>
