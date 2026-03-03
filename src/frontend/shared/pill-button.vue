<template>
  <button
    type="button"
    :class="buttonClasses"
    :disabled="disabled"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    variant?: 'green' | 'blue' | 'gray';
    disabled?: boolean;
  }>(),
  { variant: 'blue', disabled: false },
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const variantClasses: Record<string, string> = {
  green:
    'bg-green-500 hover:bg-green-400 disabled:bg-gray-400 disabled:hover:bg-gray-400',
  blue: 'bg-blue-500 hover:bg-blue-400 disabled:bg-gray-400 disabled:hover:bg-gray-400',
  gray: 'bg-gray-200 hover:bg-gray-400 disabled:bg-gray-400 disabled:hover:bg-gray-400',
};

const buttonClasses = computed(
  () =>
    `min-w-[128px] rounded-[38px] border px-[15px] py-[9px] text-sm/5 font-medium text-white shadow focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${variantClasses[props.variant]}`,
);
</script>
