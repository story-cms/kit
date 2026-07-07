<template>
  <div class="flex shrink-0 items-center gap-2">
    <button
      type="button"
      :class="[
        'rounded-xl p-1.5 transition-colors',
        shared.showMetaBox
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600',
      ]"
      :aria-pressed="shared.showMetaBox"
      aria-label="Toggle meta box"
      @click.prevent="shared.setShowMetaBox(!shared.showMetaBox)"
    >
      <Info class="size-5" aria-hidden="true" />
    </button>
    <button
      v-if="shared.config.hasAppPreview && !$page?.url?.includes('page')"
      type="button"
      :class="[
        'rounded-xl p-1.5 transition-colors',
        shared.showAppPreview
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600',
      ]"
      :aria-pressed="shared.showAppPreview"
      aria-label="Toggle app preview"
      @click.prevent="shared.setShowAppPreview(!shared.showAppPreview)"
    >
      <Smartphone class="size-5" aria-hidden="true" />
    </button>
    <button
      v-if="canDelete"
      type="button"
      class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
      aria-label="Delete draft"
      @click="emit('delete')"
    >
      <Trash2 class="size-5" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Info, Smartphone, Trash2 } from '@lucide/vue';
import { useSharedStore } from '../store';

defineProps({
  canDelete: {
    type: Boolean,
    default: true,
  },
});

const shared = useSharedStore();

const emit = defineEmits(['delete']);
</script>
