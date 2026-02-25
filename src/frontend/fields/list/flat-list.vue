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
        isEmpty(index) || isRemoved(index) ? 'py-2' : 'bg-gray-100 p-8',
        { 'mr-2': shared.showSourceColumn && field.isFlexible },
      ]"
      :style="{ gridRow: `span ${getItemSpan(index)}` }"
    >
      <template v-if="!isEmpty(index) && !isRemoved(index)">
        <template v-if="canMutate">
          <button
            v-if="field.isFlexible && shared.isTranslation && hasSourceItem(index)"
            type="button"
            class="absolute z-[1] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white text-gray-500"
            :style="{ right: `-${shared.sourceSectionWidth}px` }"
            @click="toggleRemove(index)"
          >
            <span
              v-if="!props.isReadOnly"
              class="flex h-10 w-10 items-center justify-center"
            >
              <Icon name="minus" class="size-5" />
            </span>
          </button>
          <button
            v-else
            type="button"
            class="absolute right-0 z-[1] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white text-gray-500"
            @click="emit('removeSet', index)"
          >
            <span
              v-if="!props.isReadOnly"
              class="flex h-10 w-10 items-center justify-center"
            >
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
            :is="widgets.picker(item.widget)"
            :field="item"
            :is-read-only="props.isReadOnly"
            :root-path="`${fieldPath}.${index.toString()}`"
            :is-nested="true"
          />
        </li>
      </template>
      <template v-else-if="isRemoved(index)">
        <template v-if="canMutate">
          <li class="relative flex items-center justify-between">
            <span
              class="absolute left-0 right-0 top-1/2 border-t border-gray-300"
              :style="{ width: `calc(100% + ${shared.sourceSectionWidth}px)` }"
            ></span>
            <div
              class="z-[1] inline-flex items-center rounded-full border border-gray-300 bg-gray-200 px-4 py-1.5 text-sm font-medium leading-5 text-gray-500 shadow-sm"
            >
              <span>Removed</span>
            </div>
            <button
              type="button"
              class="absolute z-[1] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white text-gray-500"
              :style="{ right: `-${shared.sourceSectionWidth}px` }"
              @click="toggleRemove(index)"
            >
              <span class="flex h-10 w-10 items-center justify-center">
                <Icon name="plus-mini" class="size-5" />
              </span>
            </button>
          </li>
        </template>
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
import { computed, ref } from 'vue';
import type { PropType } from 'vue';
import type { FieldSpec } from '../../../types';
import Icon from '../../shared/icon.vue';
import AddItemButton from '../../shared/add-item-button.vue';
import {  useSharedStore, useModelStore, useWidgetsStore } from '../../store';

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
const shared = useSharedStore();
const model = useModelStore();
const widgets = useWidgetsStore();

const canMutate = computed(() => {
  if (props.isReadOnly) return false;

  // Allow mutations if not in translation mode OR if field is flexible
  return !shared.isTranslation || field.value.isFlexible === true;
});

const sourceList = model.getSourceField(props.fieldPath, []) as any[];


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
  return Array.isArray(sourceList) && index < sourceList.length;
};

const removedList = ref<number[]>([]);









const toggleRemove = (index: number) => {
  if (removedList.value.includes(index)) {
    removedList.value.splice(removedList.value.indexOf(index), 1);
  } else {
    removedList.value.push(index);
  }
};

const isRemoved = (index: number): boolean => {
  return removedList.value.includes(index);
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

const getItemSpan = (index: number): number => {
  return isRemoved(index) ? 1 : totalSpan.value;
};

const containerSpan = computed(() => {
  let span = 1;
  for (let i = 0; i < props.listItems.length; i++) {
    span += getItemSpan(i);
  }
  return span;
});


</script>
