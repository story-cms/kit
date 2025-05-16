<template>
  <div class="relative flex items-center justify-center border-2 border-pink-600">
    <svg class="-rotate-90" :height="circleWidth" :width="circleWidth">
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
      <div v-if="humanPercentage === 100">
        <Icon name="check" class="w-4 h-auto text-green-500" />
      </div>
      <span v-else class="text-sm font-normal leading-[14px] text-gray-800"
        >{{ humanPercentage + aiPercentage }}%</span
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Icon from '../shared/icon.vue';

const props = defineProps<{
  human: number;
  ai: number;
}>();

const total = computed(() => {
  return props.human + props.ai;
});

const humanPercentage = computed(() => {
  return (props.human / total.value) * 100;
});

const aiPercentage = computed(() => {
  return (props.ai / total.value) * 100;
});

const grayPercentage = computed(() => {
  return 100 - (humanPercentage.value + aiPercentage.value);
});

const circleWidth = 66;
const center = circleWidth / 2;

// circleRadius = (width / 2) - (strokeWidth)
const circleRadius = circleWidth / 2 - 6;

const circumference = 2 * Math.PI * circleRadius;
const greenSegment = computed(() => {
  return circumference * (humanPercentage.value / 100);
});

const blueSegment = computed(() => {
  return circumference * (aiPercentage.value / 100);
});

const graySegment = computed(() => {
  return circumference * (grayPercentage.value / 100);
});
</script>
