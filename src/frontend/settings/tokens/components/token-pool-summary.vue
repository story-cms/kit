<template>
  <div class="rounded-2xl bg-gray-50 p-6">
    <div class="flex items-start justify-between gap-6">
      <div>
        <p class="text-sm text-gray-500">Central token pool</p>
        <p class="mt-1 text-2xl font-bold text-black">
          {{ poolTotal.toLocaleString() }} tokens available
        </p>
      </div>
      <div class="shrink-0 text-right text-sm text-gray-500">
        <p>{{ allocated.toLocaleString() }} allocated</p>
        <p>{{ unallocated.toLocaleString() }} unallocated</p>
      </div>
    </div>

    <div class="mt-6 flex items-center gap-8">
      <div class="relative flex size-[140px] shrink-0 items-center justify-center">
        <svg class="-rotate-90" width="140" height="140">
          <circle
            class="fill-transparent stroke-gray-200"
            stroke-width="14"
            r="63"
            cx="70"
            cy="70"
          />
          <circle
            class="fill-transparent stroke-studio-forest"
            stroke-width="14"
            r="63"
            cx="70"
            cy="70"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-sm text-gray-500">Allocated</span>
          <span class="text-2xl font-bold text-black">{{ allocatedPercent }}%</span>
        </div>
      </div>

      <dl class="space-y-2 text-sm">
        <div class="flex items-center gap-2">
          <dt class="text-gray-500">Allocated</dt>
          <dd class="font-semibold text-black">{{ allocated.toLocaleString() }}</dd>
        </div>
        <div class="flex items-center gap-2">
          <dt class="text-gray-500">Unallocated</dt>
          <dd class="font-semibold text-black">{{ unallocated.toLocaleString() }}</dd>
        </div>
        <div class="flex items-center gap-2">
          <dt class="text-gray-500">Distribution</dt>
          <dd class="font-semibold text-black">{{ potCount }} active pots</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  poolTotal: number;
  allocated: number;
  potCount: number;
}>();

const RADIUS = 63;
const circumference = 2 * Math.PI * RADIUS;

const unallocated = computed(() => Math.max(props.poolTotal - props.allocated, 0));

const allocatedPercent = computed(() =>
  props.poolTotal === 0 ? 0 : Math.round((props.allocated / props.poolTotal) * 100),
);

const dashOffset = computed(() => circumference - (allocatedPercent.value / 100) * circumference);
</script>
