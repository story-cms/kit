<template>
  <div
    :class="[
      'subgrid',
      panelBackgroundClass,
      {
        'p-8 pt-2': !field.isRow,
      },
    ]"
    :style="{ gridRow: `span ${fields.length + 1}` }"
  >
    <div
      class="relative flex"
      :class="field.labelStyle === 'header' ? 'justify-start px-2 pt-4' : 'justify-center'"
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
      :class="[
        'subgrid',
        {
          'flex flex-wrap': field.isRow,
        },
      ]"
      :style="{ gridRow: `span ${fields.length + 1}` }"
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
import { commonProps } from '../shared/helpers';
import type { FieldSpec } from '../../types';
import { useWidgetsStore, useSharedStore } from '../store';
import LabelHint from '../shared/label-hint.vue';
const shared = useSharedStore();

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
const hasError = computed(() => errors.value.length > 0 && !props.isReadOnly);
</script>
