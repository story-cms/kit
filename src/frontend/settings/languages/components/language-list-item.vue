<template>
  <div
    class="flex w-[208px] justify-between rounded-md px-2 py-5"
    :class="{ 'bg-white hover:bg-gray-100': !isSelected, 'bg-[#EFF6FF]': isSelected }"
  >
    <LanguageStrip :spec="language" />
    <div class="group grid size-4 grid-cols-1">
      <template v-if="!isAdded">

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
    </template>

    <template v-if="isAdded">

      <svg
      
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="pointer-events-none col-start-1 row-start-1 size-6 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
      >
      <path
      d="M20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12ZM14.293 9.29297C14.6835 8.90244 15.3165 8.90244 15.707 9.29297C16.0976 9.68349 16.0976 10.3165 15.707 10.707L11.707 14.707C11.3165 15.0976 10.6835 15.0976 10.293 14.707L8.29297 12.707L8.22461 12.6309C7.90426 12.2381 7.92685 11.6591 8.29297 11.293C8.65908 10.9269 9.23809 10.9043 9.63086 11.2246L9.70703 11.293L11 12.5859L14.293 9.29297ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
      fill="#9CA3AF"
      />
    </svg>
  </template>
  </div>
  </div>
</template>
<script setup lang="ts">
import type { LanguageSpecification } from '../../../../types';
import LanguageStrip from './language-strip.vue';
const props = defineProps<{
  language: LanguageSpecification;
  isSelected: boolean;
  isAdded: boolean;
}>();
const emit = defineEmits<{
  update: [isSelected: boolean];
}>();
const handleUpdate = () => {
  emit('update', !props.isSelected);
};
</script>
