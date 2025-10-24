<template>
  <details class="my-2 p-2">
    <summary>
      <div class="flex items-center justify-between">
        <span
          class="inline-flex cursor-pointer items-center rounded-full border border-gray-300 bg-white px-4 py-1.5"
        >
          <icon name="chevron-down" class="icon mr-1" aria-hidden="true" />
          <span>
            {{ summary }}
          </span>
        </span>
      </div>
    </summary>
    {{ content }}
  </details>
</template>
<script setup lang="ts">
import Icon from '../../shared/icon.vue';
defineProps<{
  summary: string;
  content: string;
}>();
</script>
<style scoped>
summary::marker,
:is(::-webkit-details-marker) {
  content: ' ';
}
</style>
