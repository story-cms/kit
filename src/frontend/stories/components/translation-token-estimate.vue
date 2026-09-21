<template>
  <div class="rounded-xl border border-gray-200 px-5 py-4">
    <template v-if="isEstimating || inputTokens === null || outputTokens === null">
      <div class="flex items-center justify-between border-b border-gray-200 pb-4">
        <span class="font-dmsans text-sm text-gray-500">Estimated cost</span>
        <span class="inline-block h-5 w-32 animate-pulse rounded-xl bg-gray-200" />
      </div>
      <div class="flex items-center justify-between pt-4">
        <span class="font-dmsans text-sm text-gray-500">Your current balance</span>
        <span
          class="flex items-center gap-2 font-dmsans text-base font-semibold text-green-600"
        >
          <span class="size-2 rounded-full bg-green-500" aria-hidden="true" />
          {{ balance.toLocaleString() }} tokens
        </span>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-between border-b border-gray-200 pb-4">
        <span class="font-dmsans text-sm text-gray-500">Estimated cost</span>
        <span class="font-dmsans text-base font-semibold text-black">
          {{ low.toLocaleString() }} – {{ high.toLocaleString() }} tokens
        </span>
      </div>
      <div class="flex items-center justify-between pt-4">
        <span class="font-dmsans text-sm text-gray-500">Your current balance</span>
        <span
          class="flex items-center gap-2 font-dmsans text-base font-semibold text-green-600"
        >
          <span class="size-2 rounded-full bg-green-500" aria-hidden="true" />
          {{ balance.toLocaleString() }} tokens
        </span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    inputTokens: number | null;
    outputTokens: number | null;
    balance: number;
    isEstimating?: boolean;
  }>(),
  {
    isEstimating: false,
  },
);

const sum = computed(() => (props.inputTokens ?? 0) + (props.outputTokens ?? 0));
const low = computed(() => Math.round(sum.value * 0.8));
const high = computed(() => Math.round(sum.value * 1.2));
</script>
