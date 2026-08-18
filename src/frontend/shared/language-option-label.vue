<template>
  <div class="min-w-0">
    <p
      class="truncate text-sm text-gray-900"
      :class="{ 'font-semibold': emphasis, 'font-normal': !emphasis }"
    >
      {{ displayName }}
    </p>
    <p class="truncate text-sm text-gray-500">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LanguageSpecification } from '../../types';
import { languageDisplayName } from './helpers';

const props = withDefaults(
  defineProps<{
    spec: LanguageSpecification;
    emphasis?: boolean;
  }>(),
  {
    emphasis: true,
  },
);

const displayName = computed(() => languageDisplayName(props.spec.language));

const subtitle = computed(() => `${displayName.value} (${props.spec.locale})`);
</script>
