<template>
  <div class="ml-8">
    <ul
      v-for="(_listItem, index) in listItems"
      :key="index"
      role="listitem"
      class="relative my-2 grid gap-y-8 bg-gray-100 p-8"
    >
      <div
        v-if="canMutate"
        class="absolute right-0 mr-3 cursor-pointer text-gray-500"
        @click="emit('removeSet', index)"
      >
        <Icon name="trash" class="h-10 w-10" />
      </div>

      <li v-for="(item, i) in fields" :key="item.name + `${i.toString()}`">
        <component
          :is="store.picker(item.widget)"
          :field="item"
          :is-read-only="props.isReadOnly"
          :root-path="`${fieldPath}.${index.toString()}`"
          :is-nested="true"
        />
      </li>
    </ul>
    <div v-if="canMutate" class="mt-8 flex flex-row items-center gap-4">
      <AddItemButton :label="field.label" @add="emit('addSet')" />
      <div v-if="showEmptyListWarning()">
        <div
          class="flex flex-row items-center rounded-full border bg-white p-2 text-error"
        >
          <Icon name="exclamation" class="pr-2" />
          <p class="text-sm">At least one item is required</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { FieldSpec } from '../../../types';
import Icon from '../../shared/icon.vue';
import AddItemButton from '../../shared/add-item-button.vue';
import { useWidgetsStore, useSharedStore } from '../../store';

const props = defineProps({
  field: {
    type: Object as PropType<FieldSpec>,
    required: true,
  },
  fieldPath: {
    type: String,
    required: true,
  },
  listItems: {
    type: Array,
    required: true,
  },
  isReadOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['addSet', 'removeSet']);
const field = computed(() => props.field as FieldSpec);
const fields = field.value.fields as FieldSpec[];
const store = useWidgetsStore();
const shared = useSharedStore();

const canMutate = computed(() => {
  if (props.isReadOnly) return false;

  return !shared.isTranslation;
});

const showEmptyListWarning = (): boolean => {
  if (props.isReadOnly) return false;
  if (props.listItems.length > 0) return false;

  for (const key in shared.errors) {
    const needle = `bundle.${props.fieldPath}`;
    if (key.startsWith(needle)) return true;
  }
  return false;
};
</script>
