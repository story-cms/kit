<template>
  <div class="space-y-4 rounded-lg bg-white px-6 py-[34px] shadow">
    <p class="text-lg font-bold leading-7 text-gray-800">
      {{ language }} ({{ locale.toUpperCase() }})
    </p>
    <div>
      <div class="grid grid-cols-[auto_min-content] gap-x-14">
        <ul
          class="grid"
          :style="{
            gridTemplateColumns: `${percentageHumanTranslation}% ${percentageAiTranslation}% ${
              100 - percentageHumanTranslation - percentageAiTranslation
            }%`,
          }"
        >
          <li
            class="relative h-[30px] bg-[#10B981] first:rounded-l-[10px] last:rounded-r-[10px] group"
          >
            <span
              class="absolute -right-5 -top-6 z-10 rounded-t-[10px] rounded-br-[10px] bg-gray-100 p-[10px] text-xs font-medium leading-4 text-black group-hover:block"
            >
              {{ percentageHumanTranslation }}%
            </span>
          </li>
          <li
            class="relative h-[30px] bg-[#3B82F6] first:rounded-l-[10px] last:rounded-r-[10px] group"
          >
            <span
              class="absolute -right-5 -top-6 z-10 rounded-t-[10px] rounded-br-[10px] bg-gray-100 p-[10px] text-xs font-medium leading-4 text-black group-hover:block"
            >
              {{ percentageAiTranslation }}%
            </span>
          </li>
          <li
            class="h-[30px] bg-transparent first:rounded-l-[10px] last:rounded-r-[10px]"
          ></li>
        </ul>
        <div class="flex flex-col items-center justify-center">
          <span
            class="px-2 py-1 text-xs font-medium leading-4 text-red-800 bg-red-100 rounded-xl"
            >{{ percentageCompleted }}%</span
          >
        </div>
      </div>
    </div>
    <p class="text-lg font-medium leading-7 text-gray-500">
      Last update: 03 January 2025
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  locale: string;
  language: string;
  humanTranslation: number;
  aiTranslation: number;
  totalTranslation: number;
  updatedAt: string;
}>();

const percentageHumanTranslation = computed(() => {
  return Math.round((props.humanTranslation / props.totalTranslation) * 100);
});

const percentageAiTranslation = computed(() => {
  return Math.round((props.aiTranslation / props.totalTranslation) * 100);
});

const percentageCompleted = computed(() => {
  return Math.round(
    ((props.humanTranslation + props.aiTranslation) / props.totalTranslation) * 100,
  );
});
</script>
