<template>
  <div class="flex flex-col">
    <div
      class="max-w-max rounded-md border-2 bg-white"
      :class="errors.length > 0 ? 'border-red-500' : 'border-white'"
    >
      <VueDatePicker
        :value="modelValue"
        :inline="{ input: true }"
        text-input
        auto-apply
        :enable-time-picker="props.enableTimePicker"
        time-picker-inline
        :is-24="false"
        position="center"
        :six-weeks="true"
        :state="!(errors.length > 0)"
        :readonly="props.isReadOnly"
      />
      <p v-if="errors.length > 0" class="p-3 text-sm text-red-500">
        {{ errors[0] }}
      </p>
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
  enableTimePicker: {
    type: Boolean,
    default: false,
  },
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

const errors = computed(() => shared.errorMessages(fieldPath.value));
</script>
