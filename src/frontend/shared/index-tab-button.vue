<template>
  <button
    type="button"
    class="flex flex-1 items-center justify-center gap-1 text-nowrap px-4 py-[9px] text-sm font-medium leading-4 transition-colors"
    :class="stateClasses"
    @click="emit('click')"
  >
    <slot />
    <span
      v-if="count !== undefined"
      class="inline-flex items-center justify-center rounded-full px-[10px] py-[2px] text-xs font-medium leading-4"
      :class="badgeClasses"
    >
      {{ count }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    isActive?: boolean;
    count?: number;
  }>(),
  {
    isActive: false,
    count: undefined,
  },
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const stateClasses = computed(() =>
  props.isActive
    ? 'bg-studio-forest text-white'
    : 'bg-white text-studio-forest hover:bg-gray-50',
);

const badgeClasses = computed(() =>
  props.isActive ? 'bg-studio-lime text-studio-forest' : 'bg-gray-100 text-gray-500',
);
</script>
