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
            gridTemplateColumns:
              percentageCompleted === 100
                ? '100%'
                : `${percentageTranslated}% ${percentagePrefilled}% ${
                    100 - percentageTranslated - percentagePrefilled
                  }%`,
          }"
        >
          <li
            v-if="percentageCompleted === 100"
            class="relative h-[30px] rounded-[10px] group"
            :class="percentageTranslated === 100 ? 'bg-[#10B981]' : 'bg-[#3B82F6]'"
          >
            <div
              class="absolute inset-x-0 z-10 items-center justify-center hidden -top-6 group-hover:flex"
            >
              <span
                class="rounded-t-[10px] rounded-br-[10px] bg-gray-100 p-[10px] text-xs font-medium leading-4 text-black"
              >
                {{ percentageCompleted }}
              </span>
            </div>
          </li>
          <template v-else>
            <li
              class="relative h-[30px] bg-[#10B981] first:rounded-l-[10px] last:rounded-r-[10px] group"
            >
              <div
                class="absolute inset-x-0 z-10 items-center justify-center hidden -top-6 group-hover:flex"
              >
                <span
                  class="rounded-t-[10px] rounded-br-[10px] bg-gray-100 p-[10px] text-xs font-medium leading-4 text-black"
                >
                  {{ percentageTranslated }}%
                </span>
              </div>
            </li>
            <li
              class="relative h-[30px] bg-[#3B82F6] first:rounded-l-[10px] last:rounded-r-[10px] group"
            >
              <div
                class="absolute inset-x-0 z-10 items-center justify-center hidden -top-6 group-hover:flex"
              >
                <span
                  class="rounded-t-[10px] rounded-br-[10px] bg-gray-100 p-[10px] text-xs font-medium leading-4 text-black"
                >
                  {{ percentagePrefilled }}%
                </span>
              </div>
            </li>
            <li
              class="h-[30px] bg-transparent first:rounded-l-[10px] last:rounded-r-[10px]"
            ></li>
          </template>
        </ul>
        <div class="flex flex-col items-center justify-center">
          <span
            class="px-2 py-1 text-xs font-medium leading-4 rounded-xl"
            :class="
              percentageCompleted === 100 && percentageTranslated === 100
                ? 'bg-green-100 text-gray-800'
                : ' text-red-800 bg-red-100'
            "
            >{{ percentageCompleted }}%</span
          >
        </div>
      </div>
    </div>
    <p class="text-lg font-medium leading-7 text-gray-500">
      Last update: {{ formattedDate }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UiProgress } from '../../../types';

const props = defineProps<UiProgress>();

const percentageTranslated = computed(() => {
  return Math.round((props.translatedCount / props.totalCount) * 100);
});

const percentagePrefilled = computed(() => {
  return Math.round((props.prefilledCount / props.totalCount) * 100);
});

const percentageCompleted = computed(() => {
  return Math.round(
    ((props.translatedCount + props.prefilledCount) / props.totalCount) * 100,
  );
});

const formattedDate = computed(() => {
  const date = new Date(props.updatedAt);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
});
</script>
