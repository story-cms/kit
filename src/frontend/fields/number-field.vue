<template>
  <div
    :class="{
      'rounded-bl-lg rounded-br-lg bg-white px-8 py-6 shadow-sm': !isNested,
    }"
  >
    <label
      :for="field.label"
      class="input-label"
      :class="{ 'text-gray-600': isReadOnly }"
    >
      {{ field.label }}
    </label>
    <div class="mt-[2px] pt-1 sm:col-span-2 sm:mt-0">
      <input
        v-model="modelValue"
        type="number"
        :readonly="props.isReadOnly"
        class="w-24 input-field"
        :class="{
          'border-error': hasError,
          'text-gray-600': props.isReadOnly,
          'shadow-none': props.isReadOnly,
        }"
        @input="update"
      />
      <p v-if="hasError" class="text-sm text-error">Please enter a number</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FieldSpec } from '../../interfaces';
import { useModelStore, useSharedStore } from '../store';
import { commonProps } from '../shared/helpers';

const props = defineProps({
  ...commonProps,
});

const model = useModelStore();
const shared = useSharedStore();

const field = computed(() => props.field as FieldSpec);
const fieldPath = computed(() => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const modelValue = props.isReadOnly
  ? ref(model.getSourceField(fieldPath.value, ''))
  : ref(model.getField(fieldPath.value, field.value.default ?? ''));
if (!model.isPopulated(fieldPath.value)) {
  model.setField(fieldPath.value, field.value.default ?? '');
}

const update = () => model.setField(fieldPath.value, modelValue.value);

model.$subscribe(() => {
  if (props.isReadOnly) return;

  modelValue.value = model.getField(fieldPath.value, '');
});

const isWeird = computed((): boolean => {
  if (typeof modelValue.value === 'string' && modelValue.value.length > 0) return true;
  return Number.isNaN(modelValue.value);
});

const errors = computed(() => shared.errorMessages(fieldPath.value));
const hasError = computed(
  () => (errors.value.length > 0 || isWeird.value === true) && !props.isReadOnly,
);
</script>
