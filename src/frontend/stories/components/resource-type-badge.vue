<template>
  <span
    class="shrink-0 rounded-xl bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
  >
    {{ resourceTypeLabel(type) }}
  </span>
</template>

<script setup lang="ts">
import { resourceTypeLabel } from './resource-utils';
import type { ResourceType } from '../../../types';

defineProps<{
  type: ResourceType;
}>();
</script>
