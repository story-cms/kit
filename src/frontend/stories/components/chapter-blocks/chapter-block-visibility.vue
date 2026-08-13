<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="text-sm text-gray-500">Visible to</span>
    <span class="h-4 w-px shrink-0 bg-gray-300" aria-hidden="true" />
    <button
      v-for="option in visibilityOptions"
      :key="option.key"
      type="button"
      class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors"
      :class="
        modelValue[option.key] ? option.activeClasses : option.inactiveClasses
      "
      :aria-pressed="modelValue[option.key]"
      @click="toggleVisibility(option.key)"
    >
      <component :is="option.icon" class="size-[14px]" aria-hidden="true" />
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { EyeOff, Monitor, Send, User } from '@lucide/vue';

import type { ChapterBlockVisibility } from '../../../../types';

const props = defineProps<{
  modelValue: ChapterBlockVisibility;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: ChapterBlockVisibility];
}>();

const toggleVisibility = (key: keyof ChapterBlockVisibility) => {
  emit('update:modelValue', { ...props.modelValue, [key]: !props.modelValue[key] });
};

const visibilityOptions: {
  key: keyof ChapterBlockVisibility;
  label: string;
  icon: Component;
  activeClasses: string;
  inactiveClasses: string;
}[] = [
  {
    key: 'presenter',
    label: 'Presenter',
    icon: Monitor,
    activeClasses: 'bg-studio-yellow text-studio-forest',
    inactiveClasses: 'border border-gray-200 bg-white text-gray-400',
  },
  {
    key: 'personal',
    label: 'Personal',
    icon: User,
    activeClasses: 'bg-studio-lime text-studio-forest',
    inactiveClasses: 'border border-gray-200 bg-white text-gray-400',
  },
  {
    key: 'inNavigation',
    label: 'In navigation',
    icon: Send,
    activeClasses: 'bg-studio-forest text-white',
    inactiveClasses: 'border border-gray-200 bg-white text-gray-400',
  },
  {
    key: 'hidden',
    label: 'Hidden',
    icon: EyeOff,
    activeClasses: 'bg-error-light text-error',
    inactiveClasses: 'border border-gray-200 bg-white text-gray-400',
  },
];
</script>
