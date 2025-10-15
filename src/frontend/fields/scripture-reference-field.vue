<template>
  <div
    :class="{
      'box-shadow-sm rounded border border-gray-200 bg-white p-8': !isNested,
      'mt-4': isNested,
    }"
  >
    <label
      :for="field.label"
      class="input-label"
      :class="{ 'text-gray-600': props.isReadOnly }"
    >
      {{ field.label }}
    </label>
    <div class="mt-[2px] pt-1 sm:col-span-2 sm:mt-0">
      <input
        :id="fieldPath"
        v-model="reference"
        type="text"
        :name="field.label"
        :readonly="props.isReadOnly"
        placeholder="John 1 or John 1:3-4"
        class="input-field text-black"
        :class="{ 'border-error': referenceHasError, 'text-gray-600': props.isReadOnly }"
        @blur="parseReference"
      />
      <p v-if="referenceHasError" class="text-sm text-error">
        {{ referenceErrorMessage }}
      </p>

      <!-- Parsed reference display -->
      <div v-if="referenceLabel && !isReadOnly" class="mt-3 flex items-center gap-2">
        <span class="rounded border bg-gray-50 px-2 py-1 text-sm text-gray-600">
          {{ referenceLabel }}
        </span>
        <button
          type="button"
          class="text-xs text-gray-400 hover:text-gray-600"
          title="Clear parsed label to re-parse"
          @click="clearParsedLabel"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted } from 'vue';
import type { FieldSpec, ScriptureReference } from '../../types';
import { useModelStore, useSharedStore } from '../store';
import { commonProps } from '../shared/helpers';
import { parseReference as parseRef } from '../shared/helpers';

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

const startValue = props.isReadOnly
  ? (model.getSourceField(fieldPath.value, {
      label: '',
      reference: '',
    }) as ScriptureReference)
  : (model.getField(fieldPath.value, {
      label: '',
      reference: '',
    }) as ScriptureReference);

const reference = ref(startValue.label);
const referenceLabel = ref(startValue.label);

const parseReference = () => {
  if (!reference.value?.trim()) {
    referenceLabel.value = '';
    model.setField(fieldPath.value, {
      label: '',
      reference: '',
    });
    return;
  }

  const parsed = parseRef(reference.value);
  if (parsed) {
    referenceLabel.value = reference.value;
    model.setField(fieldPath.value, {
      label: reference.value,
      reference: parsed,
    });
  }
};

const clearParsedLabel = () => {
  referenceLabel.value = '';
  model.setField(fieldPath.value, {
    label: '',
    reference: '',
  });
};

model.$subscribe(() => {
  if (props.isReadOnly) return;

  nextTick().then(() => {
    const fresh = model.getField(fieldPath.value) as ScriptureReference;
    reference.value = fresh.label;
    referenceLabel.value = fresh.label;
  });
});

const referenceHasError = computed(
  () => `bundle.${fieldPath.value}.reference` in shared.errors && !props.isReadOnly,
);

const referenceErrorMessage = computed(() => {
  const messages = shared.errors[`bundle.${fieldPath.value}.reference`];
  return messages.length > 0 ? messages[0] : '';
});

onMounted(async () => {
  if (!reference.value) {
    model.setField(fieldPath.value, {
      label: '',
      reference: '',
    });
  }
});
</script>
