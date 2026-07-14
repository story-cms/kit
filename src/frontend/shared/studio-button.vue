<template>
  <span
    v-if="tooltip"
    class="group relative inline-flex"
    :class="{ 'cursor-not-allowed': disabled }"
  >
    <span class="inline-flex" :class="{ 'pointer-events-none': disabled }">
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 font-dmsans text-[15px] font-semibold leading-5 tracking-[-0.15px] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        :class="[shapeClasses, variantClasses, sizeClasses]"
        :aria-label="accessibleLabel"
        :disabled="disabled"
        @click="emit('click')"
      >
        <slot />
        <span v-if="label">{{ label }}</span>
      </button>
    </span>
    <span
      role="tooltip"
      class="pointer-events-none absolute bottom-full right-0 z-20 mb-[3px] hidden w-max max-w-xs whitespace-normal rounded-lg bg-gray-900 px-2 py-px text-left text-xs font-normal leading-5 text-white group-hover:block"
    >
      {{ tooltip }}
    </span>
  </span>
  <button
    v-else
    type="button"
    class="inline-flex items-center justify-center gap-2 font-dmsans text-[15px] font-semibold leading-5 tracking-[-0.15px] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    :class="[shapeClasses, variantClasses, sizeClasses]"
    :aria-label="accessibleLabel"
    :disabled="disabled"
    @click="emit('click')"
  >
    <slot />
    <span v-if="label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

export type StudioButtonVariant =
  'primary' | 'outline' | 'secondary' | 'green' | 'blue' | 'gray' | 'red';

export type StudioButtonShape = 'default' | 'cta';

const props = withDefaults(
  defineProps<{
    label?: string;
    ariaLabel?: string;
    variant?: StudioButtonVariant;
    shape?: StudioButtonShape;
    disabled?: boolean;
    tooltip?: string;
  }>(),
  {
    variant: 'primary',
    shape: 'default',
    disabled: false,
    tooltip: undefined,
    label: undefined,
    ariaLabel: undefined,
  },
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const slots = useSlots();

const accessibleLabel = computed(() => props.ariaLabel ?? props.label);

const isIconOnly = computed(() => !props.label && !!slots.default);

const sizeClasses = computed(() => {
  if (props.shape === 'cta') return 'p-[9px]';
  if (isIconOnly.value) return 'px-3 py-3';
  return 'px-6 py-3';
});

const shapeClasses = computed(() =>
  props.shape === 'cta' ? 'rounded-[15px]' : 'rounded-full',
);

const variantClassMap: Record<StudioButtonVariant, string> = {
  primary: 'bg-studio_forest_green text-studio_lime hover:bg-studio_forest_green/90',
  outline:
    'border border-studio_forest_green bg-transparent text-studio_forest_green hover:bg-studio_forest_green/5',
  secondary: 'bg-blue-600 text-white hover:bg-blue-700',
  green: 'bg-green-500 text-white hover:bg-green-400',
  blue: 'bg-blue-500 text-white hover:bg-blue-400',
  gray: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  red: 'bg-red-500 text-white hover:bg-red-400',
};

const variantClasses = computed(() => variantClassMap[props.variant]);
</script>
