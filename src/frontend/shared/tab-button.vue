<template>
  <component
    :is="isAction ? 'button' : 'span'"
    :type="isAction ? 'button' : undefined"
    :disabled="isAction && disabled ? true : undefined"
    class="font-dmsans box-border inline-flex flex-none items-center gap-2 rounded-full border-b border-white px-4 py-3 text-sm font-medium leading-[19px] tracking-[-0.15px] [&_svg]:size-4"
    :class="[
      stateClasses,
      isAction
        ? 'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
        : 'cursor-default',
    ]"
    :aria-invalid="hasError ? true : undefined"
    @click="onClick"
  >
    <slot />
    <span v-if="label">{{ label }}</span>
    <span
      v-if="hasError"
      class="size-2 shrink-0 rounded-full bg-error"
      aria-hidden="true"
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    isActive?: boolean;
    hasError?: boolean;
    isAction?: boolean;
    disabled?: boolean;
  }>(),
  {
    label: undefined,
    isActive: false,
    hasError: false,
    isAction: true,
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const onClick = () => {
  if (!props.isAction || props.disabled) return;
  emit('click');
};

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
