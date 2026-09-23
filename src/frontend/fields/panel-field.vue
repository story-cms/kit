<template>
  <div
    :class="[
      'subgrid rounded-xl',
      panelBackgroundClass,
      useFoldableHeader ? 'border border-gray-200' : { 'p-8 pt-2': !field.isRow },
    ]"
    :style="{ gridRow: `span ${fields.length + 1}` }"
  >
    <div
      v-if="useFoldableHeader"
      class="flex items-center justify-between gap-3 overflow-hidden px-6"
      :class="[
        props.isCompact ? 'py-2' : 'py-6',
        { 'border-b border-gray-100': isExpanded },
      ]"
    >
      <button
        v-if="!props.isReadOnly"
        type="button"
        class="inline-flex items-center text-left text-sm font-semibold text-gray-800"
        @click="toggleExpanded"
      >
        <span>{{ field.label }}</span>
      </button>
      <span v-else class="text-sm font-semibold text-gray-800">{{ field.label }}</span>
      <button
        v-if="!props.isReadOnly"
        type="button"
        class="inline-flex size-8 items-center justify-center text-gray-500 hover:bg-gray-50"
        @click="toggleExpanded"
      >
        <span>
          <svg
            class="size-5 origin-center transition-transform duration-200 ease-out"
            :class="[isExpanded ? 'rotate-180' : '']"
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
    <div
      v-else
      class="relative flex"
      :class="
        field.labelStyle === 'header' ? 'justify-start px-2 pt-4' : 'justify-center'
      "
    >
      <LabelHint
        v-if="field.label && field.label.trim() !== '' && field.labelStyle === 'header'"
        :label="field.label"
        :hint="field.hint"
        :sections="field.hintSections"
        :footer="field.hintFooter"
        class="mb-2"
      />
      <button
        v-else-if="field.label && field.label.trim() !== ''"
        type="button"
        class="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span>{{ field.label }}</span>
      </button>
    </div>
    <div v-if="hasError" class="my-2 flex items-center justify-center">
      <p class="text-sm text-error">{{ panelMessage }}</p>
    </div>
    <div
      v-if="!useFoldableHeader || isExpanded"
      :class="[
        'subgrid',
        {
          'flex flex-wrap': field.isRow,
          'px-6': useFoldableHeader,
          'py-4': useFoldableHeader && props.isCompact,
          'py-6': useFoldableHeader && !props.isCompact,
        },
      ]"
      :style="{ gridRow: `span ${fields.length}` }"
    >
      <div
        v-for="(item, index) in fields"
        :key="index"
        :class="{
          'w-[calc(50%_-_16px)] p-8 odd:mr-[32px]': field.isRow,
        }"
      >
        <component
          :is="widgetFor(index)"
          :field="item"
          :root-path="childRootPath"
          :is-nested="true"
          :is-read-only="props.isReadOnly"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { commonProps, hasNestedListWidget } from '../shared/helpers';
import type { FieldSpec } from '../../types';
import { useWidgetsStore, useSharedStore } from '../store';
import { useListStateStore } from '../store/list-state';
import LabelHint from '../shared/label-hint.vue';
const shared = useSharedStore();
const listState = useListStateStore();

const props = defineProps({
  ...commonProps,
});

const store = useWidgetsStore();

const field = computed(() => props.field as FieldSpec);
const fields = field.value.fields as FieldSpec[];

const backgroundColor = computed(() => {
  return field.value.backgroundColor ? field.value.backgroundColor : 'white';
});

const panelBackgroundClass = computed(() => `bg-${backgroundColor.value}`);

const childRootPath = computed(() => props.rootPath);

const widgetFor = (key: number) => {
  if (field.value.fields === null) throw new Error('No fields defined');
  const widget = (field.value.fields as FieldSpec[])[key].widget;
  return store.picker(widget);
};

const errors = computed(() => {
  const allErrors: string[] = [];
  for (const child of fields) {
    const childPath =
      childRootPath.value !== undefined
        ? `${childRootPath.value}.${child.name}`
        : child.name;
    allErrors.push(...shared.errorMessages(childPath));
  }
  return allErrors;
});
const panelMessage = computed(
  () => field.value.panelErrorMessage ?? errors.value[0] ?? '',
);
const hasError = computed(
  () => errors.value.length > 0 && !props.isReadOnly && hasNestedListWidget(field.value),
);

const useFoldableHeader = computed(
  () =>
    !hasNestedListWidget(field.value) &&
    !!field.value.label?.trim() &&
    field.value.labelStyle !== 'header',
);

const panelPath = computed(() =>
  props.rootPath === undefined
    ? field.value.name
    : `${props.rootPath}.${field.value.name}`,
);

const isExpanded = computed(() => listState.getPanelExpanded(panelPath.value));
const toggleExpanded = () => {
  listState.setPanelExpanded(panelPath.value, !isExpanded.value);
};
</script>
