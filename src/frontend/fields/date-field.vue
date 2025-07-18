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
          :enable-time-picker="field.hasTimePicker ?? false"
          time-picker-inline
          :is-24="false"
          position="center"
          :six-weeks="true"
          :state="!(errors.length > 0)"
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
import { computed, ref, nextTick } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
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

const modelValue = props.isReadOnly
  ? ref(model.getSourceField(fieldPath.value, ''))
  : ref(model.getField(fieldPath.value, ''));

model.$subscribe(() => {
  if (props.isReadOnly) return;

  nextTick().then(() => {
    modelValue.value = model.getField(fieldPath.value, field.value.default);
  });
});

const onUpdate = (date: Date) => {
  if (props.isReadOnly) return;
  model.setField(fieldPath.value, date);
};

const errors = computed(() => shared.errorMessages(fieldPath.value));
</script>
