<template>
  <div class="w-full p-6 bg-white">
    <div v-if="props.metric && props.metric.stat && props.metric.previousStat">
      <dt class="text-base font-normal text-gray-900">{{ props.metric.name }}</dt>
      <dd class="flex items-baseline justify-between mt-1">
        <div class="flex items-baseline text-2xl font-semibold leading-8 text-gray-900">
          {{ props.metric.stat }}
          <span class="ml-2 text-sm font-medium text-gray-500"
            >from {{ props.metric.previousStat }}</span
          >
        </div>

        <div
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
          {{ change }}
        </div>
      </dd>
    </div>
    <div v-else>
      <div class="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
      <div class="flex items-baseline justify-between mt-4 md:block lg:flex">
        <div class="flex items-baseline">
          <div class="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div class="w-20 h-4 ml-2 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div
          class="w-20 h-6 mt-2 bg-gray-200 rounded-full animate-pulse md:mt-2 lg:mt-0"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { StatMetric } from '../../types';
import Icon from '../shared/icon.vue';

const props = defineProps<{
  metric: StatMetric;
}>();

const changeType = computed(() =>
  props.metric.stat - props.metric.previousStat >= 0 ? 'increase' : 'decrease',
);
const change = computed(() => Math.abs(props.metric.stat - props.metric.previousStat));
</script>
