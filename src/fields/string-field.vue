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
    <div class="mt-[2px] pt-1 sm:col-span-2 sm:mt-0">
      <input
        type="text"
        :name="field.label"
        :readonly="props.isReadOnly"
        autocomplete="given-name"
        :value="modelValue"
        class="input-field"
        :class="{
          'border-error': hasError,
          'text-gray-600': props.isReadOnly,
          'shadow-none': props.isReadOnly,
        }"
        @input="update"
      />
      <p v-if="hasError" class="text-sm text-error">{{ errors[0] }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import { FieldSpec } from '@/interfaces';
import { useModelStore, useSharedStore } from '#store';
import { commonProps } from '#shared/helpers';

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
  : ref(model.getField(fieldPath.value, ''));

const update = (event: Event) => {
  model.setField(fieldPath.value, (event.target as HTMLInputElement).value);
};

model.$subscribe(() => {
  if (props.isReadOnly) return;

  nextTick().then(() => {
    modelValue.value = model.getField(fieldPath.value, '');
  });
});

const errors = computed(() => shared.errorMessages(fieldPath.value));
const hasError = computed(() => errors.value.length > 0 && !props.isReadOnly);
</script>
