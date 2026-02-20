<template>
  <div class="flex flex-col items-center text-gray-500">
    <template v-if="hasCompleteRings">
      <div class="relative mx-auto size-24 rounded-full border-[3px] border-teal-500">
        <div class="absolute inset-0 flex items-center justify-center">
          <Icon name="check-large" class="h-auto w-6 text-teal-500" />
        </div>
      </div>
      <p class="mt-2 text-center text-xs font-medium leading-4">All done</p>
    </template>
    <template v-else>
      <div class="flex justify-between gap-8">
        <div v-for="item in ringData" :key="item.name" class="flex flex-col items-center">
          <p class="mb-2 text-center text-sm font-medium leading-4">
            {{ item.name }}
          </p>
          <div class="relative flex flex-col items-center justify-center">
            <svg
              v-if="item.label !== ''"
              class="-rotate-90"
              :height="circleWidth"
              :width="circleWidth"
            >
              <circle
                class="fill-transparent stroke-teal-500 stroke-[6px]"
                stroke="currentColor"
                :r="circleRadius"
                :cx="center"
                :cy="center"
                :stroke-dasharray="`${item.tealSegment} ${circumference}`"
                stroke-dashoffset="0"
              />
              <circle
                class="fill-transparent stroke-blue-500 stroke-[6px]"
                stroke="currentColor"
                :r="circleRadius"
                :cx="center"
                :cy="center"
                :stroke-dasharray="`${item.blueSegment} ${circumference}`"
                :stroke-dashoffset="`-${item.tealSegment}`"
              />
              <circle
                class="fill-transparent stroke-gray-200 stroke-[6px]"
                stroke="currentColor"
                :r="circleRadius"
                :cx="center"
                :cy="center"
                :stroke-dasharray="`${item.unfilledSegment} ${circumference}`"
                :stroke-dashoffset="`-${item.tealSegment + item.blueSegment}`"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div v-if="item.donePercentage === 100 && item.draftPercentage === 0">
                <Icon name="check" class="h-auto w-4 text-teal-500" />
              </div>
              <span v-else class="text-sm font-bold leading-none text-gray-800">
                {{ item.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from '../shared/icon.vue';
import type { Progress } from '../../types';

const props = defineProps<{ progress: Omit<Progress, 'lastUpdated'>[] }>();

const hasCompleteRings = computed(() => {
  return props.progress.every((stat) => stat.done === stat.total);
});

const circleWidth = 80;
const center = circleWidth / 2;
const circleRadius = circleWidth / 2 - 6;
const circumference = 2 * Math.PI * circleRadius;

function computeRingData(item: Omit<Progress, 'lastUpdated'>) {
  const isOverdone = item.done + item.draft > item.total;
  const workingDone = isOverdone
    ? item.done - (item.done + item.draft - item.total)
    : item.done;
  const donePercentage =
    item.total === 0 ? 0 : Math.round((workingDone / item.total) * 100);
  const draftPercentage =
    item.total === 0 ? 0 : Math.round((item.draft / item.total) * 100);
  const unfilledPercentage = 100 - (donePercentage + draftPercentage);

  let label = '';
  const nr = donePercentage + draftPercentage;
  if (!isNaN(nr)) {
    label = nr > 100 ? '100%' : `${nr}%`;
  }

  const tealSegment = circumference * (donePercentage / 100);
  const blueSegment = circumference * (draftPercentage / 100);
  const unfilledSegment = circumference * (unfilledPercentage / 100);

  return {
    name: item.name,
    label,
    donePercentage,
    draftPercentage,
    tealSegment,
    blueSegment,
    unfilledSegment,
  };
}

const ringData = computed(() => props.progress.map(computeRingData));
</script>
