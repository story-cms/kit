<template>
  <div class="px-3 pt-[30px]">
    <h3 class="font-['Inter'] text-2xl font-semibold leading-8 text-gray-800">
      Analytics
    </h3>
    <div class="mt-5 flex flex-col gap-5 lg:flex-row">
      <StatsTile v-for="metric in metrics" :key="metric.name" :metric="metric" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { StatMetric, AnalyticsReport } from '../../types';
import StatsTile from './stats-tile.vue';
const props = defineProps<{
  analyticsReport: AnalyticsReport;
}>();
const metrics = ref<StatMetric[]>([]);

const processMetrics = () => {
  if (!props.analyticsReport) return;
  for (const [key, value] of Object.entries(props.analyticsReport)) {
    const typedValue = value as { current: number; previous: number };
    const current = typedValue.current;
    const previous = typedValue.previous;

    const name = key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();

    metrics.value.push({
      name: name,
      stat: current,
      previousStat: previous,
    });
  }
};

onMounted(() => {
  processMetrics();
});
</script>
