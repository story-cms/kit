<template>
  <div>
    <p>Field: {{ field.name }}</p>
    <p>Widget: {{ field.widget }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FieldSpec } from '../../types';
import { commonProps } from '../shared/helpers';
const props = defineProps({
  ...commonProps,
});

const field = computed(() => props.field as FieldSpec);
</script>
