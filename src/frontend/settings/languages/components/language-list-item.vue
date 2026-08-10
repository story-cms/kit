<template>
  <component
    :is="isReadOnly ? 'div' : 'label'"
    :for="isReadOnly ? undefined : language.locale"
    class="grid w-[208px] grid-cols-[1fr_auto] gap-x-1 rounded-xl px-2 py-5"
    :class="{
      'cursor-not-allowed bg-gray-100': isReadOnly,
      'cursor-pointer': !isReadOnly,
      'bg-gray-300': isSelected && !isReadOnly,
      'hover:bg-gray-100': isAvailable,
    }"
  >
    <LanguageStrip :spec="language" />
    <div class="group grid size-4 grid-cols-1">
      <template v-if="!isReadOnly">
        <input
          :id="language.locale"
          type="checkbox"
          :checked="isSelected"
          name="language"
          aria-describedby="language-description"
          class="col-start-1 row-start-1 appearance-none rounded-[4px] border border-gray-300 bg-white text-gray-800 checked:!border-gray-800 checked:!bg-gray-800 checked:[background-image:none] checked:hover:!border-gray-800 checked:hover:!bg-gray-800 checked:focus:!border-gray-800 checked:focus:!bg-gray-800 indeterminate:!border-gray-800 indeterminate:!bg-gray-800 focus:ring-0 focus:ring-offset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
          @change="handleUpdate"
        />

        <Check
          class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center text-white opacity-0 group-has-[:checked]:opacity-100 group-has-[:disabled]:text-gray-950/25"
          aria-hidden="true"
          :stroke-width="1.5"
        />
      </template>

      <template v-else>
        <div
          class="pointer-events-none col-start-1 row-start-1 grid size-4 place-items-center rounded-[4px] border border-gray-300 bg-gray-100"
          aria-hidden="true"
        >
          <Check class="size-3.5 text-gray-400" aria-hidden="true" :stroke-width="1.5" />
        </div>
      </template>
    </div>
  </component>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Check } from '@lucide/vue';
import type { LanguageListItemProps } from '../../../../types';
import LanguageStrip from './language-strip.vue';
const props = defineProps<LanguageListItemProps>();

const emit = defineEmits<{
  update: [isSelected: boolean];
}>();

const isSelected = computed<boolean>(() => props.status === 'selected');
const isReadOnly = computed<boolean>(() => props.status === 'readonly');
const isAvailable = computed<boolean>(() => props.status === 'available');

const handleUpdate = () => {
  emit('update', !isSelected.value);
};
</script>
