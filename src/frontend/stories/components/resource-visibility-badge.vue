<template>
  <span
    v-if="visibility !== 'public'"
    class="shrink-0 rounded-xl px-2 py-0.5 text-xs font-medium capitalize"
    :class="visibilityBadgeClasses(visibility)"
  >
    {{ visibility }}
  </span>
</template>

<script setup lang="ts">
import { visibilityBadgeClasses } from './resource-utils';
import type { VisibilityType } from '../../../types';

defineProps<{ visibility: VisibilityType }>();
</script>
