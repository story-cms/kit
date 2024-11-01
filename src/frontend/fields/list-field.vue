<template>
  <FoldableList
    v-if="field.canFold"
    :field="field"
    :field-path="fieldPath"
    :list-items="listItems"
    :is-read-only="props.isReadOnly"
    @add-set="addSet"
    @remove-set="removeSet"
  />
  <FlatList
    v-else
    :field="field"
    :field-path="fieldPath"
    :list-items="listItems"
    :is-read-only="props.isReadOnly"
    @add-set="addSet"
    @remove-set="removeSet"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { commonProps } from '../shared/helpers';
import type { FieldSpec } from '../../interfaces';
import FlatList from './List/flat-list.vue';
import FoldableList from './List/foldable-list.vue';
import { useModelStore } from '../store';

const props = defineProps({
  ...commonProps,
});

const field = computed(() => props.field as FieldSpec);
const fieldPath = computed((): string => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const model = useModelStore();

const addSet = () => {
  model.addListItem(fieldPath.value);
};

const removeSet = (index: number) => {
  model.removeListItem(fieldPath.value, index);
};

const listItems = props.isReadOnly
  ? ref(model.getSourceField(fieldPath.value, []) as unknown[])
  : ref(model.getField(fieldPath.value, []) as unknown[]);

model.$subscribe(() => {
  if (props.isReadOnly) return;

  const fresh = model.getField(fieldPath.value, []) as unknown[];
  listItems.value = fresh;
});
</script>
