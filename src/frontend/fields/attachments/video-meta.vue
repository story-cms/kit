<template>
  <div class="flex flex-col gap-[19px]">
    <div v-for="row in metadataRows" :key="row.label">
      <label class="block text-sm font-semibold text-gray-500">
        {{ row.label }}
      </label>
      <div
        class="mt-2 flex items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
      >
        <span class="min-w-0 flex-1 truncate text-sm text-gray-900" :title="row.value">
          {{ row.value }}
        </span>
        <button
          type="button"
          class="shrink-0 rounded p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          :title="copiedLabel === row.label ? 'Copied!' : `Copy ${row.label}`"
          @click="copyToClipboard(row.value, row.label)"
        >
          <Icon :name="copiedLabel === row.label ? 'check' : 'clipboard'" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Icon from '../../shared/icon.vue';

defineProps<{
  metadataRows: { label: string; value: string }[];
}>();

const copiedLabel = ref<string | null>(null);
const RESET_DELAY = 1500;

const copyToClipboard = (value: string, label: string) => {
  navigator.clipboard.writeText(value);
  copiedLabel.value = label;
  setTimeout(() => {
    copiedLabel.value = null;
  }, RESET_DELAY);
};
</script>
