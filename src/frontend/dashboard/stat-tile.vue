<template>
  <div class="w-full rounded-xl bg-white p-6 shadow">
    <div>
      <dt class="font-dmsans text-xs font-normal leading-4 text-gray-900">
        <span
          v-if="isLoading"
          class="inline-block h-4 w-32 animate-pulse rounded-xl bg-gray-200"
        ></span>
        <span v-else>{{ props.metric.name }}</span>
      </dt>
      <dd class="mt-1 flex items-baseline justify-between">
        <div
          class="flex items-baseline font-dmsans text-2xl font-semibold leading-8 text-gray-900"
        >
          <template v-if="isLoading">
            <span
              class="inline-block h-8 w-24 animate-pulse rounded-xl bg-gray-200"
            ></span>
            <span
              class="ml-2 inline-block h-4 w-16 animate-pulse rounded-xl bg-gray-200"
            ></span>
          </template>
          <template v-else>
            {{ props.metric.stat.toLocaleString() }}
            <span class="ml-2 text-sm font-normal leading-5 text-gray-500"
              >from {{ props.metric.previousStat.toLocaleString() }}</span
            >
          </template>
        </div>

        <div
          v-if="!isLoading"
          :class="[
            changeType === 'increase'
              ? 'bg-studio-lime text-green-800'
              : 'bg-error-light text-error',
            'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0',
          ]"
        >
          <span class="sr-only">
            {{ changeType === 'increase' ? 'Increased' : 'Decreased' }} by
          </span>
          {{ changePercentage }}
          <Icon
            v-if="changeType === 'increase'"
            name="arrow-up"
            class="ml-1 size-3 shrink-0 self-center text-green-500"
          />
          <Icon
            v-else
            name="arrow-up"
            class="ml-1 size-3 shrink-0 rotate-180 self-center text-error"
          />
        </div>
        <div
          v-else
          class="inline-block h-6 w-16 animate-pulse rounded-xl bg-gray-200"
        ></div>
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
  if (props.metric.previousStat === 0) return '0%';
  const percentage = Math.abs(change / props.metric.previousStat) * 100;
  return `${percentage.toFixed(0)}%`;
});
</script>
