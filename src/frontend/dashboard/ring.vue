<template>
  <div>
    <div class="relative flex flex-col items-center justify-center">
      <svg
        v-if="label !== ''"
        class="-rotate-90"
        :height="circleWidth"
        :width="circleWidth"
      >
        <!-- Green segment -->
        <circle
          class="fill-transparent stroke-green-500 stroke-[6px]"
          stroke="currentColor"
          :r="circleRadius"
          :cx="center"
          :cy="center"
          :stroke-dasharray="`${greenSegment} ${circumference}`"
          stroke-dashoffset="0"
        />
        <!-- Blue segment -->
        <circle
          class="fill-transparent stroke-blue-500 stroke-[6px]"
          stroke="currentColor"
          :r="circleRadius"
          :cx="center"
          :cy="center"
          :stroke-dasharray="`${blueSegment} ${circumference}`"
          :stroke-dashoffset="`-${greenSegment}`"
        />
        <!-- Gray segment -->
        <circle
          class="fill-transparent stroke-gray-50 stroke-[6px]"
          stroke="currentColor"
          :r="circleRadius"
          :cx="center"
          :cy="center"
          :stroke-dasharray="`${graySegment} ${circumference}`"
          :stroke-dashoffset="`-${greenSegment + blueSegment}`"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <div v-if="donePercentage === 100">
          <Icon name="check" class="h-auto w-4 text-green-500" />
        </div>
        <span v-else class="text-sm font-normal leading-none text-gray-800">{{
          label
        }}</span>
      </div>
    </div>
    <p class="text-center text-sm font-medium leading-4 text-gray-500">
      {{ name }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Icon from '../shared/icon.vue';
import { Progress } from '../../types';

const props = defineProps<Progress>();

const label = computed(() => {
  const nr = donePercentage.value + draftPercentage.value;
  if (isNaN(nr)) {
    return '';
  }

  if (nr > 100) {
    return '100%';
  }

  return `${nr}%`;
});

const isOverdone = computed(() => {
  return props.done + props.draft > props.total;
});

const workingDone = computed(() => {
  if (!isOverdone.value) return props.done;
  return props.done - (props.done + props.draft - props.total);
});

const donePercentage = computed(() => {
  return Math.round((workingDone.value / props.total) * 100);
});

const draftPercentage = computed(() => {
  return Math.round((props.draft / props.total) * 100);
});

const grayPercentage = computed(() => {
  return 100 - (donePercentage.value + draftPercentage.value);
});

const circleWidth = 66;
const center = circleWidth / 2;

// circleRadius = (width / 2) - (strokeWidth)
const circleRadius = circleWidth / 2 - 6;

const circumference = 2 * Math.PI * circleRadius;

const greenSegment = computed(() => {
  return circumference * (donePercentage.value / 100);
});

const blueSegment = computed(() => {
  return circumference * (draftPercentage.value / 100);
});

const graySegment = computed(() => {
  return circumference * (grayPercentage.value / 100);
});
</script>
