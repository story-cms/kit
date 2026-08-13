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
        isActive(option.key) ? option.activeClasses : option.inactiveClasses
      "
      :aria-pressed="isActive(option.key)"
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
  if (key !== 'hidden' && props.modelValue.hidden) {
    emit('update:modelValue', { ...props.modelValue, hidden: false, [key]: true });
    return;
  }
  emit('update:modelValue', { ...props.modelValue, [key]: !props.modelValue[key] });
};

const isActive = (key: keyof ChapterBlockVisibility) => {
  if (key === 'hidden') {
    return (
      props.modelValue.hidden ||
      (!props.modelValue.presenter && !props.modelValue.personal && !props.modelValue.inNavigation)
    );
  }
  if (props.modelValue.hidden) {
    return false;
  }
  return props.modelValue[key];
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
    inactiveClasses: 'bg-studio-yellow/20 text-studio-forest',
  },
  {
    key: 'personal',
    label: 'Personal',
    icon: User,
    activeClasses: 'bg-studio-lime text-studio-forest',
    inactiveClasses: 'bg-studio-lime/20 text-studio-forest',
  },
  {
    key: 'inNavigation',
    label: 'In navigation',
    icon: Send,
    activeClasses: 'bg-studio-forest text-white',
    inactiveClasses: 'bg-studio-forest/20 text-white',
  },
  {
    key: 'hidden',
    label: 'Hidden',
    icon: EyeOff,
    activeClasses: 'bg-error-light text-error',
    inactiveClasses: 'bg-error-light/20 text-error',
  },
];
</script>
