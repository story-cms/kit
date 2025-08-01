<template>
  <div
    class="rounded-lg border border-gray-100 bg-white font-['Inter'] text-xs leading-4 text-gray-600"
  >
    <section
      v-for="item in primary"
      :key="item.label"
      class="grid grid-cols-2 bg-gray-50 px-4 py-2 text-gray-500"
    >
      <p class="font-semibold">{{ item.label }}</p>
      <span class="place-self-end text-right font-normal">{{ item.value }}</span>
    </section>
    <section
      v-for="item in secondary"
      :key="item.label"
      class="grid grid-cols-2 px-4 pb-2 font-normal text-gray-600"
    >
      <p>{{ item.label }}</p>
      <span class="place-self-end text-right">{{ item.value }}</span>
    </section>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  primary: Record<string, string>[];
  secondary: Record<string, string>[];
}>();
</script>
