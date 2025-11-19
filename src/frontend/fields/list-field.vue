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
import { ref, computed, watch } from 'vue';
import { commonProps } from '../shared/helpers';
import type { FieldSpec } from '../../types';
import FlatList from './list/flat-list.vue';
import FoldableList from './list/foldable-list.vue';
import { useModelStore, useSharedStore } from '../store';

const props = defineProps({
  ...commonProps,
});

const field = computed(() => props.field as FieldSpec);
const fieldPath = computed((): string => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const model = useModelStore();
const shared = useSharedStore();

let isAddingFlexibleItem = false;
const addSet = () => {
  if (!props.isReadOnly && shared.isTranslation && field.value.isFlexible) {
    isAddingFlexibleItem = true;
  }
  model.addListItem(fieldPath.value);
};

let isRemovingFlexibleItem = false;

const removeSet = (index: number) => {
  if (!props.isReadOnly && shared.isTranslation && field.value.isFlexible) {
    isRemovingFlexibleItem = true;
  }
  model.removeListItem(fieldPath.value, index);
};

const sourceItems = computed(() => {
  return model.getSourceField(fieldPath.value, []) as Record<string, unknown>[];
});

const translationItems = computed(() => {
  return model.getField(fieldPath.value, []) as Record<string, unknown>[];
});

const listItems = props.isReadOnly
  ? ref(buildReadOnlyListItems())
  : ref([...translationItems.value]);

function buildReadOnlyListItems(): Record<string, unknown>[] {
  const baseItems = [...sourceItems.value];

  if (!props.isReadOnly) return baseItems;
  if (!shared.isTranslation) return baseItems;
  if (!field.value.isFlexible) return baseItems;

  const translationLength = translationItems.value.length;
  const sourceLength = baseItems.length;

  if (translationLength > sourceLength) {
    const placeholdersToAdd = translationLength - sourceLength;
    const placeholders = Array.from({ length: placeholdersToAdd }, () => ({}));
    return [...baseItems, ...placeholders];
  }
  if (translationLength < sourceLength) {
    return baseItems.slice(0, translationLength);
  }

  return baseItems;
}

const syncFlexibleListLength = () => {
  if (props.isReadOnly) return;
  if (!shared.isTranslation) return;
  if (field.value.isFlexible) return;
  if (isRemovingFlexibleItem) {
    isRemovingFlexibleItem = false;
    return;
  }
  if (isAddingFlexibleItem) {
    isAddingFlexibleItem = false;
    return;
  }

  const desiredLength = sourceItems.value.length;
  const currentItems = model.getField(fieldPath.value, []) as Record<string, unknown>[];

  if (desiredLength === currentItems.length) return;

  const changedItems = [...currentItems];

  if (desiredLength > changedItems.length) {
    for (let index = changedItems.length; index < desiredLength; index += 1) {
      changedItems.push({});
    }
  } else {
    changedItems.length = desiredLength;
  }

  model.setField(fieldPath.value, changedItems);
};

const refreshListItems = () => {
  if (props.isReadOnly) {
    listItems.value = buildReadOnlyListItems();
    return;
  }
  listItems.value = model.getField(fieldPath.value, []) as Record<string, unknown>[];
};

if (!props.isReadOnly) {
  syncFlexibleListLength();
}

refreshListItems();

watch(
  [sourceItems, translationItems],
  () => {
    if (!props.isReadOnly) {
      syncFlexibleListLength();
    }
    refreshListItems();
  },
  { deep: true },
);
</script>
