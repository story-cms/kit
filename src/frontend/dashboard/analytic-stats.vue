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
import { onMounted, ref } from 'vue';
import { StatMetric, RawMetrics } from '../../types';
import StatsTile from './stats-tile.vue';
const props = defineProps<{
  rawMetrics: RawMetrics;
}>();
const metrics = ref<StatMetric[]>([]);

const processMetrics = (data: RawMetrics) => {
  // Process each metric
  for (const [key, value] of Object.entries(data)) {
    const typedValue = value as { current: number; previous: number };
    const current = typedValue.current;
    const previous = typedValue.previous;

    // Format the name to be more readable
    const name = key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();

    metrics.value.push({
      name,
      stat: current,
      previousStat: previous,
    });
  }
  return metrics.value;
};
onMounted(() => {
  processMetrics(props.rawMetrics);
});
</script>
