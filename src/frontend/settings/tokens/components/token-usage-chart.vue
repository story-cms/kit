<template>
  <div class="rounded-2xl bg-gray-50 p-6">
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-500">Daily token usage</p>
      <p class="text-sm text-gray-500">7-day window</p>
    </div>

    <div class="mt-10 flex items-end justify-between gap-2">
      <div
        v-for="day in dailyUsage"
        :key="day.day"
        class="group relative flex flex-1 flex-col items-center"
      >
        <div class="flex h-36 w-full items-end justify-center">
          <div
            tabindex="0"
            role="img"
            :aria-label="`${day.day}: ${day.tokens.toLocaleString()} tokens`"
            class="w-8 rounded-full bg-studio-forest outline-none transition-[filter] duration-150 group-hover:brightness-110 group-focus-visible:brightness-110"
            :style="{ height: `${barHeightPercent(day.tokens)}%` }"
          />
        </div>
        <p class="mt-3 text-sm text-gray-500">{{ day.day }}</p>

        <span
          role="tooltip"
          class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-max -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs font-normal text-white group-hover:block group-focus-within:block"
        >
          {{ day.tokens.toLocaleString() }} tokens
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DailyTokenUsage } from '../../../../types';

const props = defineProps<{
  dailyUsage: DailyTokenUsage[];
}>();

const MIN_HEIGHT_PERCENT = 15;

const maxTokens = computed(() =>
  Math.max(...props.dailyUsage.map((day) => day.tokens), 1),
);

const barHeightPercent = (tokens: number): number =>
  Math.max((tokens / maxTokens.value) * 100, MIN_HEIGHT_PERCENT);
</script>
