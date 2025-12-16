<template>
  <PillField
    v-bind="props"
    :pills="tags"
    :errors="errors"
    :input-value="newTag"
    @add="addTag"
    @remove="removeTag"
    @update:input-value="newTag = $event"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FieldSpec } from '../../types';
import { useModelStore, useSharedStore } from '../store/index';
import { commonProps } from '../shared/helpers';
import PillField from './pill/pill-field.vue';

const props = defineProps({
  ...commonProps,
});

const model = useModelStore();
const shared = useSharedStore();
const newTag = ref('');

watch(newTag, (value) => {
  if (value.endsWith(',')) {
    const newValue = value.slice(0, -1).trim();
    addTag(newValue);
    newTag.value = '';
  }
});

const field = computed(() => props.field as FieldSpec);
const fieldPath = computed(() => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const modelValue = computed(() => {
  return props.isReadOnly
    ? model.getSourceField(fieldPath.value, '')
    : model.getField(fieldPath.value, '');
});

const addTag = (value: string) => {
  if (value.length === 0) return;
  if (tags.value.includes(value)) return;
  const currentTags = [...tags.value, value];
  model.setField(fieldPath.value, currentTags.join(','));
  newTag.value = '';
};

const removeTag = (tag: string) => {
  const newTags = tags.value.filter((t: string) => t !== tag);
  model.setField(fieldPath.value, newTags.join(','));
};

const errors = computed(() => shared.errorMessages(fieldPath.value));

const tags = computed(() => {
  const tagString = modelValue.value;
  if (!tagString || typeof tagString !== 'string' || tagString.length === 0) return [];
  return tagString.split(',').map((t: string) => t.trim());
});
</script>
