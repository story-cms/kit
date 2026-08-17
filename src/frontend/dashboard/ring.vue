<template>
  <div :class="isArrayMode ? 'flex flex-col items-center text-gray-500' : undefined">
    <template v-if="showAggregateComplete">
      <div
        class="mx-auto flex items-center justify-center rounded-full bg-studio-lime"
        :style="{ width: `${preset.circleWidth}px`, height: `${preset.circleWidth}px` }"
      >
        <Check :class="[preset.checkClass, 'text-studio-forest']" />
      </div>
      <p class="mt-2 text-center" :class="preset.allDoneClass">All done</p>
    </template>
    <div v-else :class="isArrayMode ? 'flex justify-between gap-8' : undefined">
      <div
        v-for="item in displayItems"
        :key="item.name"
        class="flex flex-col items-center"
      >
        <p
          v-if="labelPosition === 'top' && item.name"
          class="mb-2 text-center"
          :class="preset.nameClass"
        >
          {{ item.name }}
        </p>
        <div
          v-if="item.data.isComplete"
          class="mx-auto flex items-center justify-center rounded-full bg-studio-lime"
          :style="{ width: `${geometry.circleWidth}px`, height: `${geometry.circleWidth}px` }"
        >
          <Check :class="[preset.checkClass, 'text-studio-forest']" />
        </div>
        <div v-else class="relative flex flex-col items-center justify-center">
          <svg class="-rotate-90" :height="geometry.circleWidth" :width="geometry.circleWidth">
            <template v-if="item.data.label !== ''">
              <circle
                :class="['fill-transparent stroke-gray-800', preset.strokeClass]"
                stroke="currentColor"
                :r="geometry.circleRadius"
                :cx="geometry.center"
                :cy="geometry.center"
                :stroke-dasharray="`${item.data.doneSegment} ${geometry.circumference}`"
                stroke-dashoffset="0"
              />
              <circle
                :class="['fill-transparent stroke-gray-400', preset.strokeClass]"
                stroke="currentColor"
                :r="geometry.circleRadius"
                :cx="geometry.center"
                :cy="geometry.center"
                :stroke-dasharray="`${item.data.draftSegment} ${geometry.circumference}`"
                :stroke-dashoffset="`-${item.data.doneSegment}`"
              />
              <circle
                :class="['fill-transparent stroke-gray-50', preset.strokeClass]"
                stroke="currentColor"
                :r="geometry.circleRadius"
                :cx="geometry.center"
                :cy="geometry.center"
                :stroke-dasharray="`${item.data.unfilledSegment} ${geometry.circumference}`"
                :stroke-dashoffset="`-${item.data.doneSegment + item.data.draftSegment}`"
              />
            </template>
            <circle
              v-else
              :class="['fill-transparent stroke-gray-50', preset.strokeClass]"
              stroke="currentColor"
              :r="geometry.circleRadius"
              :cx="geometry.center"
              :cy="geometry.center"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-center" :class="preset.centerClass">{{ item.data.label }}</span>
          </div>
        </div>
        <p
          v-if="labelPosition === 'bottom' && item.name"
          class="mt-2 text-center"
          :class="preset.nameClass"
        >
          {{ item.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Check } from '@lucide/vue';
import type { Progress } from '../../types';

type RingSize = 'compact' | 'card';

type RingProgressData = {
  donePercentage: number;
  draftPercentage: number;
  label: string;
  doneSegment: number;
  draftSegment: number;
  unfilledSegment: number;
  isComplete: boolean;
};

const RING_SIZES = {
  compact: {
    circleWidth: 45,
    strokeWidth: 4,
    nameClass: 'text-[10px] font-medium leading-[10px]',
    centerClass: 'text-[9px] font-normal leading-[9px] text-gray-800',
    checkClass: 'h-auto w-[13px]',
    allDoneClass: 'text-xs font-medium leading-4',
    strokeClass: 'stroke-[4px]',
  },
  card: {
    circleWidth: 66,
    strokeWidth: 6,
    nameClass: 'text-sm font-medium leading-4 text-gray-500',
    centerClass: 'text-sm font-normal leading-none text-gray-800',
    checkClass: 'h-auto w-6',
    allDoneClass: 'text-xs font-medium leading-4',
    strokeClass: 'stroke-[6px]',
  },
} as const;

function getRingGeometry(size: RingSize) {
  const { circleWidth, strokeWidth } = RING_SIZES[size];
  const center = circleWidth / 2;
  const circleRadius = circleWidth / 2 - strokeWidth;
  const circumference = 2 * Math.PI * circleRadius;

  return { circleWidth, strokeWidth, center, circleRadius, circumference };
}

function buildRingProgress(
  item: { done: number; draft: number; total: number },
  circumference: number,
): RingProgressData {
  const isOverdone = item.done + item.draft > item.total;
  const workingDone = isOverdone
    ? item.done - (item.done + item.draft - item.total)
    : item.done;
  const donePercentage =
    item.total === 0 ? 0 : Math.round((workingDone / item.total) * 100);
  const draftPercentage =
    item.total === 0 ? 0 : Math.round((item.draft / item.total) * 100);
  const unfilledPercentage = 100 - (donePercentage + draftPercentage);

  let label = '';
  const nr = donePercentage + draftPercentage;
  if (!isNaN(nr)) {
    label = nr > 100 ? '100%' : `${nr}%`;
  }

  const doneSegment = circumference * (donePercentage / 100);
  const draftSegment = circumference * (draftPercentage / 100);
  const unfilledSegment = circumference * (unfilledPercentage / 100);
  const isComplete = donePercentage === 100 && draftPercentage === 0;

  return {
    donePercentage,
    draftPercentage,
    label,
    doneSegment,
    draftSegment,
    unfilledSegment,
    isComplete,
  };
}

const props = withDefaults(
  defineProps<{
    size?: RingSize;
    labelPosition?: 'top' | 'bottom';
    progress?: Omit<Progress, 'lastUpdated'>[];
    name?: string;
    done?: number;
    draft?: number;
    total?: number;
    lastUpdated?: string;
  }>(),
  {
    size: 'card',
    labelPosition: 'bottom',
    progress: undefined,
    name: undefined,
    done: undefined,
    draft: undefined,
    total: undefined,
    lastUpdated: undefined,
  },
);

const preset = computed(() => RING_SIZES[props.size]);
const geometry = computed(() => getRingGeometry(props.size));

const isArrayMode = computed(() => props.progress !== undefined);

const showAggregateComplete = computed(() => {
  if (!props.progress?.length) return false;
  return props.progress.every((stat) => stat.done === stat.total);
});

const displayItems = computed(() => {
  if (props.progress !== undefined) {
    return props.progress.map((item) => ({
      name: item.name,
      data: buildRingProgress(item, geometry.value.circumference),
    }));
  }

  return [
    {
      name: props.name ?? '',
      data: buildRingProgress(
        {
          done: props.done ?? 0,
          draft: props.draft ?? 0,
          total: props.total ?? 0,
        },
        geometry.value.circumference,
      ),
    },
  ];
});
</script>
