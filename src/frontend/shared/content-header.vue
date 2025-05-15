<template>
  <div>
    <slot name="welcome-banner"></slot>
    <slot name="content-stats"></slot>
    <div class="flex items-center justify-between px-3 py-10">
      <h3
        class="font-['Inter'] text-2xl font-semibold leading-8 text-gray-800 [&>span]:text-gray-400"
        v-html="title"
      ></h3>
      <div class="flex items-center space-x-6">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="w-full px-3">
      <slot name="extra-actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
