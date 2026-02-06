<template>
  <div
    class="p-8"
    :class="{
      'my-[32px] rounded bg-white p-[32px]': !isNested,
      subgrid: isNested,
    }"
    :style="isNested ? { gridRow: `span ${totalSpan}` } : undefined"
  >
    <div v-if="field.label">
      <label class="input-label mb-3">
        {{ field.label }}
      </label>
    </div>

    <template v-if="isNested">
      <component
        :is="widgetFor(key)"
        v-for="key in Object.keys(field.fields!)"
        :key="key"
        :field="spec(key)"
        :root-path="fieldPath"
        :is-nested="true"
        :is-read-only="props.isReadOnly"
      />
    </template>
    <ul v-else class="grid gap-y-6">
      <li v-for="key in Object.keys(field.fields!)" :key="key">
        <component
          :is="widgetFor(key)"
          :field="spec(key)"
          :root-path="fieldPath"
          :is-nested="true"
          :is-read-only="props.isReadOnly"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { commonProps } from '../shared/helpers';
import type { FieldSpec } from '../../types';
import { useWidgetsStore } from '../store';

interface FieldMap {
  [key: string]: FieldSpec;
}

const props = defineProps({
  ...commonProps,
});

const field = computed(() => props.field as FieldSpec);
const isNested = computed(() => props.isNested);

const fieldPath = computed(() => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const totalSpan = computed(() => {
  if (!field.value.fields) return 1;
  const start = field.value.label ? 1 : 0;
  return Object.keys(field.value.fields).length + start;
});

const store = useWidgetsStore();

const widgetFor = (key: string) => {
  if (field.value.fields === null) throw new Error('No fields defined');
  const widget = (field.value.fields as FieldMap)[key].widget;
  return store.picker(widget);
};

const spec = (key: string): FieldSpec => {
  if (field.value.fields === null) throw new Error('No fields defined');
  return (field.value.fields as FieldMap)[key];
};
</script>
