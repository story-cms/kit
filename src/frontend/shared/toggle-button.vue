<template>
  <button
    type="button"
    class="inline-flex items-center gap-x-2 rounded-full px-3.5 py-1.5 text-sm font-medium shadow-sm ring-1 ring-inset"
    :class="{
      'bg-indigo-100 text-indigo-700 ring-indigo-700': isActive,
      'bg-white text-gray-700 ring-gray-300': !isActive,
    }"
    @click="$emit('toggle')"
  >
    <Icon :name="icon" />
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from './icon.vue';

const props = defineProps<{
  iconOn: string;
  iconOff: string;
  label: string;
  isOn: boolean;
  isActive: boolean;
}>();

defineEmits<{
  (e: 'toggle'): void;
}>();

const icon = computed(() => {
  return props.isOn ? props.iconOn : props.iconOff;
});
</script>
