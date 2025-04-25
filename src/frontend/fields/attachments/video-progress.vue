<template>
  <div class="bg-white" :class="{ 'p-8': !isNested, 'mt-4': isNested }">
    <div class="relative">
      <label class="input-label">{{ field.label }}</label>
    </div>
    <div
      class="relative mt-[2px] h-48 w-full rounded-md border-2 border-dashed border-gray-300"
    >
      <!-- Progress bar background -->
      <div
        v-if="!isDone"
        class="absolute bottom-0 left-0 h-full w-full rounded-md bg-transparent"
      >
        <!-- Progress bar fill -->
        <div class="h-full bg-accent opacity-30" :style="progress"></div>
      </div>
      <!-- Percentage indicator -->
      <div class="absolute inset-0 flex items-center justify-center text-lg text-accent">
        <div v-if="isDone" class="flex flex-col items-center justify-center">
          <div><Icon name="check" /></div>
          <div class="text-sm font-medium text-gray-500">
            Processing video for playback
          </div>
        </div>
        <span v-else>{{ percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { commonProps } from '../../shared/helpers';
import { FieldSpec } from '../../../types';
import Icon from '../../shared/icon.vue';

interface Props {
  field: FieldSpec;
  rootPath?: string;
  isNested: boolean;
  isReadOnly?: boolean;
  bytesUploaded: number;
  bytesTotal: number;
}

const props = defineProps({
  ...commonProps,
  bytesUploaded: {
    type: Number,
    required: true,
  },
  bytesTotal: {
    type: Number,
    required: true,
  },
});

const field = computed(() => props.field as FieldSpec);

const isDone = computed(() => {
  const p = props as Props;
  return p.bytesUploaded >= p.bytesTotal;
});

const percentage = computed(() => {
  const p = props as Props;
  return Math.round((p.bytesUploaded / p.bytesTotal) * 100);
});

const progress = computed(() => {
  return {
    width: `${percentage.value}%`,
  };
});
</script>
