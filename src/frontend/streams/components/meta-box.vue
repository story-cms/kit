<template>
    <div class="rounded-lg border font-['Inter'] text-gray-600 shadow bg-white">
      <div v-for="item in primary" class="grid grid-cols-2 px-4 py-2 bg-gray-50">
        <p class="text-sm font-semibold leading-5 text-gray-500">{{ item.label }}</p>
        <span class="place-self-end text-right text-sm font-normal leading-5">{{
          item.value
        }}</span>
      </div>
      <div v-for="item in secondary" class="grid grid-cols-2 px-4 pb-2 text-gray-600">
        <p class="text-sm font-normal leading-5">{{ item.label }}</p>
        <span class="place-self-end text-right text-sm font-normal leading-5">{{
          item.value
        }}</span>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  interface Props {
    primary: Array<{ label: string; value: string }>;
    secondary: Array<{ label: string; value: string }>;
  }
  
  defineProps<Props>();
  </script>
  