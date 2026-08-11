<template>
  <ScriptureField :field="fieldSpec" :root-path="rootPath" :is-nested="true" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';

import type { FieldSpec, Scripture } from '../../../types';
import ScriptureField from '../../fields/scripture-field.vue';
import { useModelStore } from '../../store';

const props = withDefaults(
  defineProps<{
    modelValue: Scripture;
    blockId: string;
    label?: string;
  }>(),
  {
    label: 'Scripture',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: Scripture];
}>();

const model = useModelStore();
const rootPath = computed(() => `_contentBlocks.${props.blockId}`);
const scripturePath = computed(() => `${rootPath.value}.scripture`);

const fieldSpec = computed(
  (): FieldSpec => ({
    label: props.label,
    name: 'scripture',
    widget: 'scripture',
  }),
);

const readScripture = (): Scripture =>
  model.getField(scripturePath.value, { reference: '', verse: '' }) as Scripture;

watch(
  () => props.modelValue,
  (value) => {
    const current = readScripture();
    if (
      current.reference === value.reference &&
      current.verse === value.verse
    ) {
      return;
    }
    model.setField(scripturePath.value, value);
  },
  { immediate: true, deep: true },
);

const unsubscribe = model.$subscribe(() => {
  const fresh = readScripture();
  if (
    fresh.reference === props.modelValue.reference &&
    fresh.verse === props.modelValue.verse
  ) {
    return;
  }
  emit('update:modelValue', { ...fresh });
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>
