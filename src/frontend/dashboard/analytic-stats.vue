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
          <StatsTile
            v-for="metric in metrics"
            :key="metric.name"
            :metric="metric"
            :is-loading="isLoading"
          />
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
import { ref, watch } from 'vue';
import { StatMetric, AnalyticsReport } from '../../types';
import StatsTile from './stats-tile.vue';

const props = defineProps<{
  analyticsReport: AnalyticsReport;
  isLoading: boolean;
  error: string | null;
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

watch(
  () => props.isLoading,
  (newVal) => {
    if (!newVal) {
      processMetrics();
    }
  },
  { immediate: true, deep: true, flush: 'pre' },
);
</script>
