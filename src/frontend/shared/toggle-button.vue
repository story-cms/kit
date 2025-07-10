<template>
  <button
    type="button"
    class="'bg-white inline-flex items-center gap-x-2 rounded-full px-3.5 py-2.5 text-sm font-medium shadow-sm ring-1 ring-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
}>();

defineEmits<{
  (e: 'toggle'): void;
}>();

const icon = computed(() => {
  return props.isOn ? props.iconOn : props.iconOff;
});
</script>
