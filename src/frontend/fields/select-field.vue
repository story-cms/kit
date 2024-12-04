<template>
  <div
    :class="{
      'rounded border border-gray-200 bg-white p-8 shadow': !isNested,
      'mt-4': isNested,
    }"
  >
    <div class="flex flex-col">
      <label
        :for="fieldPath"
        class="mt-1 mr-2 input-label"
        :class="{ 'text-gray-600': isReadOnly }"
      >
        {{ field.label }}
      </label>
      <select
        :id="fieldPath"
        v-model="selection"
        name="select"
        :disabled="isDisabled"
        class="py-2 pl-3 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg max-w-min focus:border-blue-500 focus:ring-blue-500"
        :class="{
          'border-red-500': hasError,
          'text-gray-600': props.isReadOnly,
          'appearance-none [-moz-appearance:none] [-webkit-appearance:none]': isDisabled,
        }"
        @change="update"
      >
        <option v-for="{ value, label } in field.options" :key="value" :value="value">
          {{ label }}
        </option>
      </select>

      <p v-if="hasError" class="text-sm text-error">{{ errors[0] }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import type { FieldSpec } from '../../types';
import { useModelStore, useSharedStore } from '../store';
import { commonProps } from '../shared/helpers';

const props = defineProps({
  ...commonProps,
  // in a side-by-side translation form this field needs to be readonly
  // set :is-free="true" when using this component outside of story draft form
  isFree: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const model = useModelStore();
const shared = useSharedStore();

const field = computed(() => props.field as FieldSpec);
const isDisabled = computed(() => {
  if (props.isFree) return false;
  return props.isReadOnly || shared.isTranslation;
});
const fieldPath = computed(() => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

if (!model.isPopulated(fieldPath.value)) {
  model.setField(fieldPath.value, field.value.default);
}
const selection = props.isReadOnly
  ? ref(model.getSourceField(fieldPath.value, field.value.default))
  : ref(model.getField(fieldPath.value, field.value.default));

model.$subscribe(() => {
  if (props.isReadOnly) return;

  nextTick().then(() => {
    selection.value = model.getField(fieldPath.value, field.value.default);
  });
});

const update = () => {
  model.setField(fieldPath.value, selection.value);
};

const errors = computed(() => shared.errorMessages(fieldPath.value));
const hasError = computed(() => errors.value.length > 0 && !props.isReadOnly);
</script>
