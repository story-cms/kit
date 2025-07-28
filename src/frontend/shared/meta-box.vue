<template>
  <div class="rounded-lg border bg-white font-['Inter'] text-gray-600 shadow">
    <div
      v-for="item in primary"
      :key="item.label"
      class="grid grid-cols-2 bg-gray-50 px-4 py-2"
    >
      <p class="text-sm font-semibold leading-5 text-gray-500">{{ item.label }}</p>
      <span class="place-self-end text-right text-sm font-normal leading-5">{{
        item.value
      }}</span>
    </div>
    <div
      v-for="item in secondary"
      :key="item.label"
      class="grid grid-cols-2 px-4 pb-2 text-gray-600"
    >
      <p class="text-sm font-normal leading-5">{{ item.label }}</p>
      <span class="place-self-end text-right text-sm font-normal leading-5">{{
        item.value
      }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  primary: Record<string, string>[];
  secondary: Record<string, string>[];
}>();
</script>
