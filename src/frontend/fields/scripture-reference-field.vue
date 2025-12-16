<template>
  <PillField
    v-bind="props"
    :pills="modelValue"
    :errors="errors"
    pill-bg-color="bg-gray-100"
    pill-text-color="text-gray-500"
    :input-value="newTag"
    :show-input="!isFull"
    @add="addTag"
    @remove="removeTag"
    @update:input-value="newTag = $event"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FieldSpec } from '../../types';
import { useModelStore, useSharedStore } from '../store';
import { commonProps } from '../shared/helpers';
import { parseReference } from '../shared/helpers';
import PillField from './pill/pill-field.vue';

const props = defineProps({
  ...commonProps,
});

const model = useModelStore();
const shared = useSharedStore();

const field = computed(() => {
  const result = props.field as FieldSpec;
  if (result?.allowMany === undefined) result.allowMany = true;
  return result;
});

const fieldPath = computed(() => {
  if (!field.value?.name) return '';
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const modelValue = computed(() => {
  const value = props.isReadOnly
    ? model.getSourceField(fieldPath.value, [])
    : model.getField(fieldPath.value, []);
  return Array.isArray(value) ? value : [];
});

model.$subscribe(() => {
  if (props.isReadOnly) return;
  // modelValue is computed, so it will update automatically
});

const errors = computed(() => shared.errorMessages(fieldPath.value));

const newTag = ref('');

watch(newTag, (value: string) => {
  if (value.endsWith(',')) {
    const cleanValue = value.slice(0, -1).trim();
    const isOK = addTag(cleanValue);
    if (!isOK) newTag.value = cleanValue;
  }
});

const addTag = (value: string): boolean => {
  const parsed = parseReference(value);
  if (parsed === '') return false;
  const currentValue = modelValue.value;
  if (currentValue.includes(parsed)) return false;
  if (isFull.value) return false;

  model.setField(fieldPath.value, [...currentValue, parsed]);
  newTag.value = '';
  return true;
};

const removeTag = (tag: string) => {
  const currentValue = modelValue.value;
  const newTags = currentValue.filter((t: string) => t !== tag);
  model.setField(fieldPath.value, newTags);
};

const isFull = computed(() => {
  if (!field.value.allowMany) return modelValue.value.length > 0;
  return false;
});
</script>
