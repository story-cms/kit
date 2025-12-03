<template>
  <ul
    v-for="(_listItem, index) in listItems"
    :key="index"
    class="row-[span_100] mb-8 grid grid-rows-subgrid"
  >
    <li :class="['relative row-[span_100] grid grid-rows-subgrid']">
      <template v-if="!isEmpty(index)">
        <div
          :class="[
            'absolute bottom-0 left-4 top-4 h-[calc(100%-20px)] border-l border-gray-300',
            {
              hidden: !isExpanded(index) || isReadOnly || isRemoved(index),
            },
          ]"
        ></div>
        <button
          v-if="isExpanded(index) && !isReadOnly && !isRemoved(index)"
          type="button"
          class="absolute bottom-0 left-2 px-1.5 py-2 bg-white rounded shadow-sm cursor-pointer"
          @click="toggle(index)"
        >
          <Icon name="chevron-up-down" class="w-3.5 h-3.5 text-gray-700" />
        </button>
        <div class="flex relative justify-between items-center">
          <span
            :class="[
              'absolute left-0 right-0 top-[19px]',
              {
                'border-t border-red-500': isReadOnly,
                'border-t border-gray-300': !isReadOnly,
              },
            ]"
          ></span>

          <template v-if="isRemoved(index)">
            <div
              class="z-[1] inline-flex items-center rounded-full border border-gray-300 bg-gray-200 px-4 py-1.5 text-sm font-medium leading-5 text-gray-500 shadow-sm"
            >
              <icon name="chevron-right" class="mr-1 icon" aria-hidden="true" />
              <span> Removed: {{ String(title(index)) }} </span>
            </div>

            <button
              v-if="canMutate"
              type="button"
              class="z-[1] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white text-gray-500"
              @click="toggleRemove(index)"
            >
              <span class="flex justify-center items-center w-10 h-10">
                <Icon name="plus-mini" class="size-5" />
              </span>
            </button>
          </template>

          <template v-else>
            <button
              type="button"
              class="z-[1] inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :disabled="isReadOnly"
              :class="{ 'opacity-0': isReadOnly }"
              @click.prevent="toggle(index)"
            >
              <icon
                v-if="isExpanded(index)"
                name="chevron-down"
                class="mr-1 icon"
                aria-hidden="true"
              />
              <icon v-else name="chevron-right" class="mr-1 icon" aria-hidden="true" />
              <span>
                {{ String(sectionTitle(index)) }}
              </span>
            </button>
            <div v-if="itemHasError(index)" class="z-[1] text-accent-one">
              <div class="p-2 bg-white rounded-full border">
                <Icon name="exclamation" class="w-10 h-10 text-red-500" />
              </div>
            </div>

            <button
              v-if="canMutate"
              type="button"
              :class="[
                'z-[2] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white text-gray-500',
                { 'absolute right-[-200px]': field.isFlexible && canMutate },
              ]"
              @click="toggleRemove(index)"
            >
              <span v-if="!isReadOnly" class="flex justify-center items-center w-10 h-10">
                <Icon
                  :name="field.isFlexible && canMutate ? 'minus' : 'trash'"
                  :class="field.isFlexible && canMutate ? 'size-5' : 'h-auto w-auto'"
                />
              </span>
            </button>
          </template>
        </div>
        <ul
          v-if="isExpanded(index) && !isRemoved(index)"
          :class="[
            'row-[span_100] grid grid-rows-subgrid bg-white',
            { 'ml-8': !isReadOnly },
          ]"
        >
          <li
            v-for="(item, i) in fields"
            :key="item.name + `${i.toString()}`"
            class="grid grid-rows-subgrid"
          >
            <component
              :is="widgets.picker(item.widget)"
              :class="{
                'rounded bg-white': item.widget != 'list',
                'rounded bg-white p-8': isIsland(item.widget),
              }"
              :field="item"
              :is-read-only="props.isReadOnly"
              :root-path="`${fieldPath}.${index.toString()}`"
              :is-nested="true"
            />
          </li>
        </ul>
      </template>
    </li>
  </ul>
  <div v-if="canMutate" class="flex gap-4 items-center">
    <AddItemButton :label="field.label" @add="emit('addSet')" />
    <div v-if="showEmptyListWarning()">
      <div class="flex flex-row items-center p-2 bg-white rounded-full border text-error">
        <Icon name="exclamation" class="pr-2" />
        <p class="text-sm">At least one item is required</p>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>
<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import type { PropType } from 'vue';
import type { FieldSpec } from '../../../types';
import Icon from '../../shared/icon.vue';
import { useModelStore, useWidgetsStore, useSharedStore } from '../../store';
import AddItemButton from '../../shared/add-item-button.vue';

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
const model = useModelStore();
const widgets = useWidgetsStore();
const shared = useSharedStore();

const removedIndices = ref(new Set<number>());

const canMutate = computed(() => {
  if (props.isReadOnly) return false;

  // Allow mutations if not in translation mode OR if field is flexible
  return !shared.isTranslation || field.value.isFlexible === true;
});

const isIsland = (type: string): boolean => {
  const singleWidgets = ['string', 'number', 'markdown', 'image', 'boolean', 'select'];
  return singleWidgets.includes(type);
};

const toggleState = computed(() => widgets.getListToggles(props.fieldPath));

const ensureToggles = () => {
  const current = toggleState.value;
  if (current.length < props.listItems.length) {
    const needed = props.listItems.length - current.length;
    const fresh = [...current, ...new Array(needed).fill(true)];
    widgets.setListToggles(props.fieldPath, fresh);
  }
};

watch(() => props.listItems.length, ensureToggles, { immediate: true });

const isExpanded = (index: number): boolean => {
  return toggleState.value[index];
};

const toggle = (index: number) => {
  const fresh = toggleState.value;
  fresh[index] = !fresh[index];

  widgets.setListToggles(props.fieldPath, fresh);
};

const toggleRemove = (index: number) => {
  if (removedIndices.value.has(index)) {
    removedIndices.value.delete(index);
  } else {
    removedIndices.value.add(index);

    const fresh = toggleState.value;
    if (fresh[index]) {
      fresh[index] = false;
      widgets.setListToggles(props.fieldPath, fresh);
    }
  }
};

const isRemoved = (index: number): boolean => {
  return removedIndices.value.has(index);
};

const sectionTitle = (index: number): string => {
  const peek = title(index);
  return `${field.value.label} : ${peek}`;
};

const title = (index: number): string => {
  let path = `${props.fieldPath}.${index.toString()}`;
  if (field.value.index) {
    path = `${path}.${field.value.index}`;
  } else {
    path = `${path}.${fields[0].name}`;
  }
  const itemTitle = model.getField(path, 'New Section') as string;

  return itemTitle.length > 20 ? `${itemTitle.substring(0, 20)}...` : itemTitle;
};

const itemHasError = (index: number): boolean => {
  if (props.isReadOnly) return false;
  for (const key in shared.errors) {
    const needle = `bundle.${props.fieldPath}.${index}`;
    if (key.startsWith(needle)) return true;
  }
  return false;
};

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
