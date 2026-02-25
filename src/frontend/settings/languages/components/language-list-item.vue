<template>
  <div class="flex w-[208px] justify-between rounded-md bg-white px-2 py-5">
    <div class="text-sm font-medium leading-5">
      <p class="text-gray-700">Afar</p>
      <p class="text-gray-500">Afar (aa)</p>
    </div>
    <div class="group grid size-4 grid-cols-1">
      <input
        :id="language.locale"
        type="checkbox"
        :checked="isSelected"
        name="language"
        aria-describedby="language-description"
        class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
        @change="handleUpdate"
      />
      <svg
        viewBox="0 0 14 14"
        fill="none"
        class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
      >
        <path
          d="M3 8L6 11L11 3.5"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="opacity-0 group-has-[:checked]:opacity-100"
        />
        <path
          d="M3 7H11"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="opacity-0 group-has-[:indeterminate]:opacity-100"
        />
      </svg>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { LanguageSpecification } from '../../../../types';
const props = defineProps<{
  language: LanguageSpecification;
  isSelected: boolean;
}>();
const emit = defineEmits<{
  update: [isSelected: boolean];
}>();
const handleUpdate = () => {
  emit('update', !props.isSelected);
};
</script>
