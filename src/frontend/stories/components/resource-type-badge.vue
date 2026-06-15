<template>
  <span
    class="shrink-0 rounded px-2 py-0.5 text-xs font-medium"
    :class="resourceTypeColor(type)"
  >
    {{ type }}
  </span>
</template>

<script setup lang="ts">
import { resourceTypeColor } from './resource-utils';
import type { ResourceFormat } from '../../../types';

defineProps<{
  type: ResourceFormat;
}>();
</script>
