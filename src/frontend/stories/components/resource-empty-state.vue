<template>
  <div class="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
    <FolderOpen class="mx-auto mb-4 size-12 text-gray-400" aria-hidden="true" />
    <h3 class="mb-2 text-lg font-medium text-gray-900">No resources attached yet</h3>
    <p class="mb-4 text-sm text-gray-500">
      Search for resources above or create new ones to attach to this course
    </p>
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
      @click="emit('browse')"
    >
      <Search class="size-4" aria-hidden="true" />
      Browse Resources
    </button>
  </div>
</template>

<script setup lang="ts">
import { FolderOpen, Search } from '@lucide/vue';

const emit = defineEmits<{
  browse: [];
}>();
</script>
