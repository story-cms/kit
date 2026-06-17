<template>
  <button
    type="button"
    class="font-dmsans inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold leading-5 tracking-[-0.15px] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    :class="variantClasses"
    :disabled="disabled"
    @click="emit('click')"
  >
    <slot />
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    variant?: 'outline' | 'primary';
    disabled?: boolean;
  }>(),
  {
    variant: 'primary',
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const variantClasses = computed(() => {
  if (props.variant === 'outline') {
    return 'border border-studio_forest_green bg-transparent text-studio_forest_green hover:bg-studio_forest_green/5';
  }

  return 'bg-studio_forest_green text-studio_lime hover:bg-studio_forest_green/90';
});
</script>
