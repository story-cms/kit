<template>
  <div class="py-11">
    <p
      v-if="errorMessage"
      class="mb-4 text-center text-sm text-error"
    >
      {{ errorMessage }}
    </p>
    <p class="text-center font-dmsans text-base font-normal leading-7 text-studio-forest">
      Add blocks to build out a chapter and shape your content. <br />
      You can add as many blocks as you like. <br />
      If you're working with repeatable content you'll have the chance to reuse this
      structure on future chapters.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  errorMessage?: string;
}>();
</script>
