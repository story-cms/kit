<template>
  <div class="w-full p-6 bg-white rounded-lg shadow">
    <div>
      <dt class="text-base font-normal text-gray-900">
        <span
          v-if="isLoading"
          class="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse"
        ></span>
        <span v-else>{{ props.metric.name }}</span>
      </dt>
      <dd class="flex items-baseline justify-between mt-1">
        <div class="flex items-baseline text-2xl font-semibold leading-8 text-gray-900">
          <template v-if="isLoading">
            <span class="inline-block w-24 h-8 bg-gray-200 rounded animate-pulse"></span>
            <span
              class="inline-block w-16 h-4 ml-2 bg-gray-200 rounded animate-pulse"
            ></span>
          </template>
          <template v-else>
            {{ props.metric.stat.toLocaleString() }}
            <span class="ml-2 text-sm font-medium text-gray-500"
              >from {{ props.metric.previousStat.toLocaleString() }}</span
            >
          </template>
        </div>

        <div
          v-if="!isLoading"
          :class="[
            changeType === 'increase'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800',
            'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0',
          ]"
        >
          <Icon
            v-if="changeType === 'increase'"
            name="arrow-up"
            class="-ml-1 mr-0.5 size-3 shrink-0 self-center text-green-500"
          />
          <Icon
            v-else
            name="arrow-up"
            class="-ml-1 mr-0.5 size-3 shrink-0 rotate-180 self-center text-red-500"
          />

          <span class="sr-only">
            {{ changeType === 'increase' ? 'Increased' : 'Decreased' }} by
          </span>
          {{ changePercentage }}
        </div>
        <div v-else class="inline-block w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
      </dd>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { StatMetric } from '../../types';
import Icon from '../shared/icon.vue';

const props = defineProps<{
  metric: StatMetric;
  isLoading?: boolean | true;
}>();

const changeType = computed(() =>
  props.metric.stat - props.metric.previousStat >= 0 ? 'increase' : 'decrease',
);

const changePercentage = computed(() => {
  const change = props.metric.stat - props.metric.previousStat;
  const percentage = Math.abs(change / props.metric.previousStat) * 100;
  return `${percentage.toFixed(0)}%`;
});
</script>
