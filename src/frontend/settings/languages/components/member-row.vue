<template>
  <div class="flex flex-col text-xs font-medium leading-4">
    <p class="text-black">{{ name }}</p>
    <p class="text-gray-500">{{ email }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  name: string;
  email: string;
}>();
</script>
