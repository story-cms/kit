<template>
  <ul v-for="(_listItem, index) in listItems" :key="index">
    <li
      class="relative pt-10 pl-3 mb-8 ml-3 bg-transparent border-gray-300"
      :class="{
        'border-l': isExpanded(index) && !isReadOnly,
        'border-t': !isReadOnly && (!shared.isTranslation || drafts.isSingleColumn),
      }"
    >
      <div
        v-if="shared.isTranslation && !drafts.isSingleColumn && !isReadOnly"
        class="absolute left-0 right-0 top-0 w-[calc(47rem_*_2)] border-t border-gray-300"
      ></div>

      <div
        v-if="!isReadOnly"
        class="absolute right-0 flex items-center justify-between ml-2 -left-5"
        :class="{
          '-top-[17.6px]': shared.isTranslation,
          '-top-5': !shared.isTranslation,
        }"
      >
        <button
          type="button"
          class="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
        <div
          v-if="itemHasError(index)"
          class="cursor-pointer text-accent-one"
          @click.prevent="toggle(index)"
        >
          <div class="p-2 bg-white border rounded-full">
            <Icon name="exclamation" class="w-10 h-10 text-red-500" />
          </div>
        </div>
        <button
          v-if="canMutate"
          type="button"
          class="flex items-center justify-center w-10 h-10 text-gray-500 bg-white border rounded-full cursor-pointer"
          @click="emit('removeSet', index)"
        >
          <span v-if="!isReadOnly" class="flex items-center justify-center w-10 h-10">
            <Icon name="trash" class="w-auto h-auto" />
          </span>
        </button>
      </div>
      <ul v-if="isExpanded(index)">
        <li v-for="(item, i) in fields" :key="item.name + `${i.toString()}`" class="grid">
          <component
            :is="widgets.picker(item.widget)"
            :class="{
              'rounded border border-gray-200 bg-white drop-shadow-sm':
                item.widget != 'list',
              'mt-8 rounded border border-gray-200  bg-white p-8 shadow': isIsland(
                item.widget,
              ),
            }"
            :field="item"
            :is-read-only="props.isReadOnly"
            :root-path="`${fieldPath}.${index.toString()}`"
            :is-nested="true"
          />
        </li>
      </ul>
      <button
        v-if="isExpanded(index) && !isReadOnly"
        type="button"
        class="absolute -bottom-0 -left-3 cursor-pointer rounded bg-white px-1.5 py-2 shadow-sm"
        @click="toggle(index)"
      >
        <Icon name="chevron-up-down" class="h-3.5 w-3.5 text-gray-700" />
      </button>
    </li>
  </ul>
  <div v-if="canMutate" class="flex items-center gap-4">
    <AddItemButton :label="field.label" @add="emit('addSet')" />
    <div v-if="listNeedsItem()" class="cursor-pointer text-accent-one">
      <div class="p-2 bg-white border rounded-full flex flex-row items-center">
        <Icon name="exclamation" class="pr-2 text-red-500" />
        <p class="text-sm text-error">At least one item is required</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { FieldSpec } from '../../../types';
import Icon from '../../shared/icon.vue';
import {
  useModelStore,
  useWidgetsStore,
  useSharedStore,
  useDraftsStore,
} from '../../store';
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
const drafts = useDraftsStore();

const canMutate = computed(() => {
  if (props.isReadOnly) return false;

  return !shared.isTranslation;
});

const isIsland = (type: string): boolean => {
  const singleWidgets = ['string', 'number', 'markdown', 'image', 'boolean', 'select'];
  return singleWidgets.includes(type);
};

widgets.setListToggles(props.fieldPath, [true, true, true, true, true]);
const toggleState = computed(() => widgets.getListToggles(props.fieldPath));

const isExpanded = (index: number): boolean => {
  return toggleState.value[index];
};

const toggle = (index: number) => {
  const fresh = toggleState.value;
  fresh[index] = !fresh[index];

  widgets.setListToggles(props.fieldPath, fresh);
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

const listNeedsItem = (): boolean => {
  if (props.isReadOnly) return false;
  let foundItem = false;
  for (const key in shared.errors) {
    const needle = `bundle.${props.fieldPath}`;
    if (key.startsWith(needle)) {
      const remaining = key.slice(needle.length);
      if (remaining.startsWith('.') && /\d+/.test(remaining.slice(1))) {
        foundItem = true;
      }
    }
    if (!foundItem && props.listItems.length === 0) return true;
    return false;
  }
};
</script>
