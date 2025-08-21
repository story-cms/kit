<template>
  <div>
    <button @click="emit('toggle')">
      <Icon :name="iconName" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@story-cms/kit/ui';
import { computed } from 'vue';

const props = defineProps<{
  isList: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();

const iconName = computed(() => {
  return props.isList ? 'grid' : 'list';
});
</script>
