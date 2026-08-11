<template>
  <section class="rounded-xl border border-gray-200 bg-gray-50 p-4">
    <legend class="input-label mb-3">Visibility</legend>
    <div class="flex items-center gap-6">
      <label
        v-for="option in visibilityOptions"
        :key="option.key"
        class="flex cursor-pointer items-center gap-3"
      >
        <input
          type="checkbox"
          class="size-[22px] rounded border-gray-300 text-studio-forest focus:ring-blue-500"
          :checked="modelValue[option.key]"
          @change="
            updateVisibility(option.key, ($event.target as HTMLInputElement).checked)
          "
        />
        <div class="flex items-center gap-2 rounded" :class="option.iconBackgroundClass">
          <component
            :is="option.icon"
            class="size-[14px] text-studio-forest"
            aria-hidden="true"
          />
        </div>
        <span class="text-sm font-medium text-gray-900">{{ option.label }}</span>
      </label>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { EyeOff, Monitor, User } from '@lucide/vue';

import type { ChapterBlockVisibility } from '../../../../types';

const props = defineProps<{
  modelValue: ChapterBlockVisibility;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: ChapterBlockVisibility];
}>();

const updateVisibility = (key: keyof ChapterBlockVisibility, checked: boolean) => {
  emit('update:modelValue', { ...props.modelValue, [key]: checked });
};

const visibilityOptions: {
  key: keyof ChapterBlockVisibility;
  label: string;
  icon: Component;
  iconBackgroundClass: string;
}[] = [
  {
    key: 'presenter',
    label: 'Presenter',
    icon: Monitor,
    iconBackgroundClass: 'bg-studio-yellow p-[5px]',
  },
  {
    key: 'personal',
    label: 'Personal',
    icon: User,
    iconBackgroundClass: 'bg-studio-lime p-[5px]',
  },
  {
    key: 'hidden',
    label: 'Hidden',
    icon: EyeOff,
    iconBackgroundClass: 'bg-red-200 p-[5px]',
  },
];
</script>
