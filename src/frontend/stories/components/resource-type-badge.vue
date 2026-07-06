<template>
  <span
    class="shrink-0 rounded-xl px-2 py-0.5 text-xs font-medium"
    :class="resourceTypeColor(type)"
  >
    {{ resourceTypeLabel(type) }}
  </span>
</template>

<script setup lang="ts">
import { resourceTypeColor, resourceTypeLabel } from './resource-utils';
import type { ResourceType } from '../../../types';

defineProps<{
  type: ResourceType;
}>();
</script>
