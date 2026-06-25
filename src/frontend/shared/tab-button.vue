<template>
  <button
    type="button"
    class="font-dmsans box-border inline-flex flex-none items-center gap-2 rounded-full border-b border-white px-4 py-3 text-sm font-medium leading-[19px] tracking-[-0.15px] [&_svg]:size-4"
    :class="stateClasses"
    :aria-invalid="hasError ? true : undefined"
    @click="emit('click')"
  >
    <slot />
    <span v-if="label">{{ label }}</span>
    <span
      v-if="hasError"
      class="size-2 shrink-0 rounded-full bg-error"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = withDefaults(
  defineProps<{
    label?: string;
    isActive?: boolean;
    hasError?: boolean;
  }>(),
  {
    label: undefined,
    isActive: false,
    hasError: false,
  },
);
const emit = defineEmits<{
  (e: 'click'): void;
}>();
const stateClasses = computed(() => {
  if (props.isActive) {
    if (props.hasError) {
      return 'border border-error bg-[#F3F4F6] text-error [&_svg]:text-error';
    }
    return 'bg-[#F3F4F6] text-[#182E33] [&_svg]:text-[#111827]';
  }
  if (props.hasError) {
    return 'bg-transparent text-error [&_svg]:text-error';
  }
  return 'bg-transparent text-[#6A7282] [&_svg]:text-[#6A7282]';
});
</script>
