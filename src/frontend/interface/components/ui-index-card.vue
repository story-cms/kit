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
                : `${percentageHumanTranslation}% ${percentageAiTranslation}% ${
                    100 - percentageHumanTranslation - percentageAiTranslation
                  }%`,
          }"
        >
          <li
            v-if="percentageCompleted === 100"
            class="relative h-[30px] bg-[#10B981] rounded-[10px] group"
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
                  {{ percentageHumanTranslation }}%
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
                  {{ percentageAiTranslation }}%
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
              percentageCompleted === 100
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

const formattedDate = computed(() => {
  const date = new Date(props.updatedAt);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
});
</script>
