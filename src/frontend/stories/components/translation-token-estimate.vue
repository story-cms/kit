<template>
  <div>
    <div class="rounded-xl border border-gray-200 px-5 py-4">
      <template v-if="isEstimating || inputTokens === null || outputTokens === null || balance === null">
        <div class="flex items-center justify-between border-b border-gray-200 pb-4">
          <span class="font-dmsans text-sm text-gray-500">Estimated cost</span>
          <span class="inline-block h-5 w-32 animate-pulse rounded-xl bg-gray-200" />
        </div>
        <div class="flex items-center justify-between pt-4">
          <span class="font-dmsans text-sm text-gray-500">Your current balance</span>
          <span class="inline-block h-5 w-24 animate-pulse rounded-xl bg-gray-200" />
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
            class="flex items-center gap-2 font-dmsans text-base font-semibold"
            :class="isInsufficient ? 'text-gray-500' : 'text-green-600'"
          >
            <span
              class="size-2 rounded-full"
              :class="isInsufficient ? 'bg-gray-400' : 'bg-green-500'"
              aria-hidden="true"
            />
            {{ Math.max(0, balance).toLocaleString() }} tokens
          </span>
        </div>
      </template>
    </div>

    <p
      v-if="!isEstimating && inputTokens !== null && outputTokens !== null && balance !== null && isInsufficient"
      class="mt-3 font-dmsans text-sm font-medium text-red-600"
    >
      Translation tokens are few or do not exist.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { estimatedTokenRange, hasSufficientBalance } from '../standard-chapter-edit-controller';

const props = withDefaults(
  defineProps<{
    inputTokens: number | null;
    outputTokens: number | null;
    balance: number | null;
    isEstimating?: boolean;
  }>(),
  {
    isEstimating: false,
  },
);

const range = computed(() =>
  estimatedTokenRange(props.inputTokens ?? 0, props.outputTokens ?? 0),
);
const low = computed(() => range.value.low);
const high = computed(() => range.value.high);

const isInsufficient = computed(
  () =>
    !hasSufficientBalance(props.balance ?? 0, props.inputTokens ?? 0, props.outputTokens ?? 0),
);
</script>
