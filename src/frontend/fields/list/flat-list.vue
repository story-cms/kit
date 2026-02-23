<template>
  <div
    :class="[
      'ml-8',
      {
        subgrid: !isNested,
        'grid grid-cols-1': isNested,
      },
    ]"
    :style="!isNested ? { gridRow: `span ${containerSpan}` } : undefined"
  >
    <ul
      v-for="(_listItem, index) in listItems"
      :key="index"
      role="listitem"
      :class="[
        'subgrid relative my-2 gap-y-8',
        isEmpty(index) ? '' : 'bg-gray-100 p-8',
        { 'mr-2': shared.showSourceColumn && field.isFlexible },
      ]"
      :style="{ gridRow: `span ${totalSpan}` }"
    >
      <template v-if="!isEmpty(index)">
        <template v-if="canMutate">
          <button
            v-if="field.isFlexible && shared.isTranslation && hasSourceItem(index)"
            type="button"
            class="absolute z-[1] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white text-gray-500"
            :style="{ right: `-${shared.sourceSectionWidth}px` }"
            @click="emit('removeSet', index)"
          >
            <span v-if="!props.isReadOnly" class="flex h-10 w-10 items-center justify-center">
              <Icon name="minus" class="size-5" />
            </span>
          </button>
          <button
            v-else
            type="button"
            class="absolute right-0 z-[1] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white text-gray-500"
            @click="emit('removeSet', index)"
          >
            <span v-if="!props.isReadOnly" class="flex h-10 w-10 items-center justify-center">
              <Icon name="trash" class="h-auto w-auto" />
            </span>
          </button>
        </template>

        <li
          v-for="(item, i) in fields"
          :key="item.name + `${i.toString()}`"
          :style="{ gridRow: `span ${getFieldSpan(item)}` }"
        >
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
import { useWidgetsStore, useSharedStore, useModelStore } from '../../store';

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
  isNested: {
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
const model = useModelStore();

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

const hasSourceItem = (index: number): boolean => {
  const sourceList = model.getSourceField(props.fieldPath, []) as any[];
  return Array.isArray(sourceList) && index < sourceList.length;
};

const getFieldSpan = (field: FieldSpec): number => {
  if (field.widget === 'object' && field.fields) {
    return Object.keys(field.fields).length;
  }
  return 1;
};

const totalSpan = computed(() => {
  return fields.reduce((acc, field) => acc + getFieldSpan(field), 0);
});

const containerSpan = computed(() => {
  return props.listItems.length * totalSpan.value + 1;
});
</script>
