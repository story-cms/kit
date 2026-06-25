<template>
  <div class="subgrid">
    <ul
      v-for="(_listItem, index) in loopListItems"
      :key="index"
      class="relative my-2 list-none rounded-xl border border-gray-200 p-0"
      :draggable="!shared.isTranslation"
      @dragstart="onDragStart(index)"
      @dragover.prevent
      @drop="onDrop(index)"
      @dragend="onDragEnd"
    >
      <li class="rounded-xl bg-white">
        <div
          :class="[
            'flex items-center justify-between gap-3 overflow-hidden px-4 py-3',
            { 'border-b border-gray-100': isExpanded(index) },
          ]"
        >
          <div class="flex items-center gap-3">
            <button
              v-if="!shared.isTranslation"
              type="button"
              class="cursor-move text-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Reorder section"
            >
              <Icon name="drag" class="h-5 w-5" />
            </button>
            <span
              v-if="headerIcon"
              class="inline-flex shrink-0 items-center justify-center text-gray-400"
              aria-hidden="true"
            >
              <Icon :name="headerIcon" class="h-5 w-5" />
            </span>
            <button
              type="button"
              class="inline-flex items-center text-left text-sm font-semibold text-gray-800"
              @click="toggle(index)"
            >
              <span>{{ sectionTitle(index) }}</span>
            </button>
          </div>
          <div class="flex items-center justify-center gap-x-3">
            <div v-if="itemHasError(index)" class="text-error">
              <Icon name="exclamation" class="size-5" aria-hidden="true" />
            </div>
            <button
              v-if="!shared.isTranslation"
              type="button"
              class="inline-flex h-8 w-8 shrink-0 items-center justify-center"
              @click="onDelete(index)"
            >
              <Icon name="trash" class="size-5 hover:text-error" />
            </button>
            <button
              type="button"
              class="inline-flex size-8 items-center justify-center text-gray-500 hover:bg-gray-50"
              @click="toggle(index)"
            >
              <span>
                <svg
                  class="size-5 origin-center transition-transform duration-200 ease-out"
                  :class="[isExpanded(index) ? 'rotate-180' : '']"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 12.5L10 7.5L5 12.5"
                    stroke="currentColor"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <ul
          v-if="isExpanded(index)"
          class="subgrid m-0 w-full list-none gap-y-6 px-4 py-6"
        >
          <li
            v-for="(item, itemIndex) in fields"
            :key="item.name + itemIndex.toString()"
            :class="item.widget === 'object' || item.widget === 'list' ? 'subgrid' : ''"
          >
            <div v-if="shared.isTranslation" class="grid grid-cols-2 gap-x-4 px-8">
              <component
                :is="widgets.picker(item.widget)"
                :field="item"
                :is-read-only="false"
                :root-path="`${fieldPath}.${index.toString()}`"
                :is-nested="true"
              />

              <component
                :is="widgets.picker(item.widget)"
                :field="item"
                :is-read-only="true"
                :root-path="`${fieldPath}.${index.toString()}`"
                :is-nested="true"
              />
            </div>

            <component
              :is="widgets.picker(item.widget)"
              v-else
              :field="item"
              :is-read-only="false"
              :root-path="`${fieldPath}.${index.toString()}`"
              :is-nested="true"
            />
          </li>
        </ul>
      </li>
    </ul>

    <div v-if="!shared.isTranslation" class="mt-6 flex w-full flex-col">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-xl border-2 border-dashed border-indigo-700 bg-indigo-50 px-3 py-[18px] text-sm font-medium leading-4 text-indigo-700 shadow-sm"
        @click.prevent="addSet"
      >
        <div class="inline-flex items-center justify-center gap-2">
          <span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 1V5M5 5V9M5 5H9M5 5L1 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="currentColor"
              />
            </svg>
          </span>
          <span class="ml-2">Add {{ sectionType }}</span>
        </div>
      </button>

      <div v-if="showEmptyListWarning()">
        <div
          class="mt-2 flex flex-row items-center rounded-full border bg-white p-2 text-error"
        >
          <Icon name="exclamation" class="pr-2" />
          <p class="text-sm">At least one item is required</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { FieldSpec } from '../../../types';
import { commonProps } from '../../shared/helpers';
import { useModelStore, useSharedStore, useWidgetsStore } from '../../store';
import Icon from '../../shared/icon.vue';

const props = defineProps({
  ...commonProps,
  sectionType: {
    type: String,
    default: 'Section',
  },
  headerIcon: {
    type: String,
    default: '',
  },
});

const newSectionTitle = computed(() =>
  shared.isTranslation ? '---' : `New ${props.sectionType}`,
);

const emit = defineEmits<{
  (event: 'delete', index: number): void;
}>();

const field = computed(() => props.field as FieldSpec);
const fields = computed(() => (field.value.fields || []) as FieldSpec[]);
const fieldPath = computed(() => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const model = useModelStore();
const shared = useSharedStore();
const widgets = useWidgetsStore();

const loopListItems = computed(() => {
  return shared.isTranslation
    ? (model.getSourceField(fieldPath.value, []) as Record<string, unknown>[])
    : listItems.value;
});

const listItems = computed(() => {
  return model.getField(fieldPath.value, []) as Record<string, unknown>[];
});

const expanded = ref<boolean[]>([]);
const syncExpanded = () => {
  const count = listItems.value.length;
  if (expanded.value.length === count) return;
  const fresh = [...expanded.value];
  while (fresh.length < count) fresh.push(true);
  fresh.length = count;
  expanded.value = fresh;
};

watch(listItems, syncExpanded, { deep: true, immediate: true });

const itemHasError = (index: number): boolean => {
  if (shared.isTranslation) return false;
  const needle = `bundle.${fieldPath.value}.${index}`;
  return Object.keys(shared.errors).some((key) => key.startsWith(needle));
};

const showEmptyListWarning = (): boolean => {
  if (shared.isTranslation) return false;
  if (listItems.value.length > 0) return false;

  const needle = `bundle.${fieldPath.value}`;
  return Object.keys(shared.errors).some((key) => key.startsWith(needle));
};

const expandErroredSections = () => {
  if (shared.isTranslation) return;

  const count = listItems.value.length;
  if (count === 0) return;

  const fresh = [...expanded.value];
  while (fresh.length < count) fresh.push(true);

  let changed = false;
  for (let index = 0; index < count; index++) {
    if (itemHasError(index) && !fresh[index]) {
      fresh[index] = true;
      changed = true;
    }
  }

  if (changed) {
    expanded.value = fresh;
  }
};

watch(() => shared.errors, expandErroredSections, { deep: true, immediate: true });

const isExpanded = (index: number): boolean => expanded.value[index] ?? true;

const toggle = (index: number) => {
  const fresh = [...expanded.value];
  fresh[index] = !isExpanded(index);
  expanded.value = fresh;
};

const sectionTitle = (index: number): string => {
  let path = `${fieldPath.value}.${index.toString()}`;
  if (field.value.index) {
    path = `${path}.${field.value.index}`;
  } else if (fields.value[0]) {
    path = `${path}.${fields.value[0].name}`;
  }

  const title = model.getField(path, newSectionTitle.value) as string;
  return title && title.length > 0 ? title : newSectionTitle.value;
};

const addSet = () => {
  model.addListItem(fieldPath.value);
};

const onDelete = (index: number) => {
  emit('delete', index);
  model.removeListItem(fieldPath.value, index);
};

const dragFromIndex = ref<number | null>(null);
const onDragStart = (index: number) => {
  if (shared.isTranslation) return;
  dragFromIndex.value = index;
};

const onDragEnd = () => {
  dragFromIndex.value = null;
};

const onDrop = (toIndex: number) => {
  if (shared.isTranslation) return;
  if (dragFromIndex.value === null) return;
  if (dragFromIndex.value === toIndex) return;

  const items = [...listItems.value];
  const [moved] = items.splice(dragFromIndex.value, 1);
  if (!moved) return;
  items.splice(toIndex, 0, moved);
  model.setField(fieldPath.value, items);

  const toggles = [...expanded.value];
  const [movedToggle] = toggles.splice(dragFromIndex.value, 1);
  toggles.splice(toIndex, 0, movedToggle ?? true);
  expanded.value = toggles;
  dragFromIndex.value = null;
};
</script>
