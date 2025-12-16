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
          :model-value="modelValue"
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

const startValues = (): [string, string] => {
  const glued = props.isReadOnly
    ? model.getSourceField(fieldPath.value, '')
    : model.getField(fieldPath.value, '');
  const [start, end] = glued.split('|');
  return [start, end];
};

const modelValue = ref(startValues());

model.$subscribe(() => {
  if (props.isReadOnly) return;
  const fresh = startValues();

  modelValue.value = fresh;
});

const onUpdate = (date: [Date | null, Date | null]) => {
  if (props.isReadOnly) return;
  const fresh = date.map((d) => d?.toISOString()).join('|');
  console.log(fresh);
  model.setField(fieldPath.value, fresh);
};

const errors = computed(() => shared.errorMessages(fieldPath.value));
</script>
