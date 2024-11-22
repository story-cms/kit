<template>
  <li class="col-span-1 p-3 bg-white rounded-lg shadow">
    <div>
      <label :for="item.key" class="block text-sm font-medium leading-6 text-gray-900">{{
        label
      }}</label>
      <div class="mt-2">
        <textarea
          :id="item.key"
          :value="model"
          rows="4"
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          :class="{
            'border-red-400': error,
          }"
          @input="$emit('update:model', ($event.target as HTMLTextAreaElement)?.value)"
        />
      </div>
    </div>
    <div class="mt-2">English: {{ item.source }}</div>

    <div v-if="error" class="mt-2 text-red-400">{{ error }}</div>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UiItem } from '../../../../interfaces';

const props = defineProps<{
  item: UiItem;
  model: string | undefined;
  error: string | undefined;
}>();

defineEmits(['update:model']);

const label = computed(() => {
  return props.item.description || `Field ${props.item.key}`;
});
</script>
