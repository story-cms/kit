<template>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <label class="text-sm font-medium text-gray-700" for="token-pot-filter-threshold">
        Tokens less than
      </label>
      <input
        id="token-pot-filter-threshold"
        v-model.number="threshold"
        type="number"
        min="0"
        class="input-field w-28"
      />
      <select v-model="field" class="input-field w-36">
        <option value="remaining">remaining</option>
        <option value="allocated">allocated</option>
        <option value="used">used</option>
      </select>
    </div>
    <p class="text-sm text-gray-500">{{ matchedCount }} languages matched</p>
  </div>
</template>

<script setup lang="ts">
import type { TokenPotField } from '../../../../types';

defineProps<{
  matchedCount: number;
}>();

const threshold = defineModel<number | null>('threshold', { default: 1000 });
const field = defineModel<TokenPotField>('field', { default: 'remaining' });
</script>
