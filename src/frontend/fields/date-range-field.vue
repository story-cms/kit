<template>
  <div
    :class="{
      'rounded border border-gray-200 bg-white p-8 drop-shadow-sm': !isNested,
      'mt-4': isNested,
    }"
  >
    <label
      :for="field.label"
      class="input-label"
      :class="{ 'text-gray-600': isReadOnly }"
    >
      {{ field.label }}
    </label>
    <div class="mt-[2px] flex flex-col pt-1 sm:col-span-2 sm:mt-0">
      <div
        class="max-w-max rounded-md border-2 bg-white"
        :class="errors.length > 0 ? 'border-red-500' : 'border-white'"
      >
        <VueDatePicker
          :model-value="modelValue as any"
          inline
          auto-apply
          :six-weeks="true"
          :range="{}"
          :time-config="{ enableTimePicker: false }"
          :input-attrs="{ state: !(errors.length > 0) }"
          :readonly="props.isReadOnly"
          @update:model-value="onUpdate"
        />
        <p v-if="errors.length > 0" class="p-3 text-sm text-red-500">
          {{ errors[0] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import type { FieldSpec } from '../../types';
import { useModelStore, useSharedStore } from '../store/index';
import { commonProps } from '../shared/helpers';

type WidgetValue = [Date | null, Date | null];

const props = defineProps({
  ...commonProps,
});

const model = useModelStore();
const shared = useSharedStore();

const field = computed(() => props.field as FieldSpec);
const fieldPath = computed(() => {
  if (!field.value?.name) return '';
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const getValueFromStore = (): WidgetValue => {
  const glued = props.isReadOnly
    ? model.getSourceField(fieldPath.value, '')
    : model.getField(fieldPath.value, '');

  if (!glued || glued.trim() === '') {
    return [null, null];
  }

  const parts = glued.split('|');
  const startStr = parts[0]?.trim();
  const endStr = parts[1]?.trim();

  const start = startStr ? new Date(startStr) : null;
  const end = endStr ? new Date(endStr) : null;

  // Validate dates - if invalid, return null
  const startDate = start && !isNaN(start.getTime()) ? start : null;
  const endDate = end && !isNaN(end.getTime()) ? end : null;

  return [startDate, endDate];
};

const modelValue = ref<WidgetValue>(getValueFromStore());

model.$subscribe(() => {
  if (props.isReadOnly) return;
  const fresh = getValueFromStore();
  modelValue.value = fresh;
});

const onUpdate = (date: WidgetValue) => {
  if (props.isReadOnly) return;

  // Guard against null dates - only update if both dates are valid
  if (!date[0] || !date[1]) {
    return;
  }

  const fresh = `${date[0].toISOString()}|${date[1].toISOString()}`;
  model.setField(fieldPath.value, fresh);
};

const errors = computed(() => shared.errorMessages(fieldPath.value));
</script>
