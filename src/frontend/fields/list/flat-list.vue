<template>
  <div class="subgrid row-[span_1000] ml-8">
    <ul
      v-for="(_listItem, index) in listItems"
      :key="index"
      role="listitem"
      :class="[
        'relative my-2 gap-y-8',
        isEmpty(index) ? '' : 'bg-gray-100 p-8',
        { 'mr-2': shared.showSourceColumn && field.isFlexible },
      ]"
    >
      <template v-if="!isEmpty(index)">
        <div
          v-if="canMutate"
          class="absolute right-0 mr-3 cursor-pointer text-gray-500"
          @click="emit('removeSet', index)"
        >
          <Icon
            :name="field.isFlexible && canMutate ? 'minus' : 'trash'"
            :class="field.isFlexible && canMutate ? 'size-5' : 'h-auto w-auto'"
          />
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
      </template>
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

  // Allow mutations if not in translation mode OR if field is flexible
  return !shared.isTranslation || field.value.isFlexible === true;
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

const isEmpty = (index: number): boolean => {
  if (!props.isReadOnly) return false;
  const item = props.listItems[index] as Record<string, unknown>;
  return Object.keys(item).length === 0;
};
</script>
