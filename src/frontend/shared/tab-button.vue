<template>
  <button
    type="button"
    class="box-border inline-flex flex-none items-center gap-2 rounded-full border-b border-white px-4 py-3 font-dmsans text-sm font-medium leading-[19px] tracking-[-0.15px] [&_svg]:size-4"
    :class="stateClasses"
    @click="emit('click')"
  >
    <slot />
    <span v-if="label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    isActive?: boolean;
  }>(),
  {
    label: undefined,
    isActive: false,
  },
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const stateClasses = computed(() => {
  if (props.isActive) {
    return 'bg-[#F3F4F6] text-[#182E33] [&_svg]:text-[#111827]';
  }

  return 'bg-transparent text-[#6A7282] [&_svg]:text-[#6A7282]';
});
</script>
