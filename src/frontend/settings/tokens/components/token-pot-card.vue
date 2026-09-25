<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h4 class="truncate font-dmsans text-base font-semibold text-black">
            {{ pot.name }}
          </h4>
          <span
            class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
            :class="isLow ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
          >
            {{ isLow ? 'Low' : pot.allocated.toLocaleString() }}
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500">
          {{ pot.used.toLocaleString() }} used · {{ remaining.toLocaleString() }} remaining
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <button
          type="button"
          class="flex size-8 items-center justify-center rounded-full bg-studio-yellow text-studio-forest transition-colors hover:bg-studio-yellow/80"
          :aria-label="`Increase ${pot.name} allocation`"
          @click="emit('increase')"
        >
          <Plus class="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="flex size-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:bg-gray-50"
          :aria-label="`Decrease ${pot.name} allocation`"
          @click="emit('decrease')"
        >
          <Minus class="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        class="h-full rounded-full bg-studio-dark"
        :style="{ width: `${percentUsed}%` }"
      />
    </div>

    <div class="mt-2 flex items-center justify-between text-sm">
      <span class="text-gray-500">{{ percentUsed }}% used</span>
      <span class="font-semibold text-black">
        {{ pot.used.toLocaleString() }} / {{ pot.allocated.toLocaleString() }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Minus, Plus } from '@lucide/vue';
import type { TokenPot } from '../../../../types';
import { isLowPot, potPercentUsed, potRemaining } from '../tokens';

const props = defineProps<{
  pot: TokenPot;
}>();

const emit = defineEmits<{
  increase: [];
  decrease: [];
}>();

const remaining = computed(() => potRemaining(props.pot));
const percentUsed = computed(() => potPercentUsed(props.pot));
const isLow = computed(() => isLowPot(props.pot));
</script>
