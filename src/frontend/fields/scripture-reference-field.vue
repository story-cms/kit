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

    <div
      class="mt-[2px] grid gap-x-2 rounded-md border border-gray-300 bg-white pb-1 pt-1"
      :class="
        modelValue.length > 0 && !props.isReadOnly
          ? 'grid-cols-[auto_minmax(32%,_1fr)]'
          : 'grid-cols-[1fr]'
      "
    >
      <div
        class="flex flex-wrap items-center gap-2 text-base text-gray-500 sm:text-sm/6"
        :class="modelValue.length > 0 ? 'pl-3' : 'px-0'"
        @click="inputRef?.focus()"
      >
        <span
          v-for="tag in modelValue"
          :key="tag"
          class="inline-flex flex-wrap items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium leading-4 text-gray-500"
        >
          {{ tag }}
          <button
            v-if="!props.isReadOnly"
            role="button"
            type="button"
            @click.prevent="removeTag(tag)"
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.64645 0.646447C6.84171 0.451184 7.15822 0.451185 7.35348 0.646447C7.54874 0.841709 7.54874 1.15822 7.35348 1.35348L4.70699 3.99996L7.35348 6.64645L7.38766 6.68453C7.54783 6.88092 7.53654 7.17042 7.35348 7.35348C7.17042 7.53654 6.88092 7.54783 6.68453 7.38766L6.64645 7.35348L3.99996 4.70699L1.35348 7.35348C1.15822 7.54874 0.841709 7.54874 0.646447 7.35348C0.451185 7.15822 0.451184 6.84171 0.646447 6.64645L3.29293 3.99996L0.646447 1.35348L0.612267 1.31539C0.452092 1.119 0.463389 0.829504 0.646447 0.646447C0.829504 0.463389 1.119 0.452092 1.31539 0.612267L1.35348 0.646447L3.99996 3.29293L6.64645 0.646447Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </span>
      </div>
      <input
        v-if="!props.isReadOnly && !isFull"
        ref="inputRef"
        v-model="newTag"
        type="text"
        :name="field.label"
        class="mr-1 block rounded-r-md border-0 bg-white py-1 pl-0 text-sm font-normal leading-5 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white"
        @keydown.enter.stop="addTag(newTag)"
      />
    </div>

    <p v-if="hasError" class="text-sm text-error">{{ errors[0] }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FieldSpec } from '../../types';
import { useModelStore, useSharedStore } from '../store';
import { commonProps } from '../shared/helpers';
import { parseReference } from '../shared/helpers';

const props = defineProps({
  ...commonProps,
});

const model = useModelStore();
const shared = useSharedStore();

const field = computed(() => {
  const result = props.field as FieldSpec;
  if (result?.allowMany === undefined) result.allowMany = true;
  return result;
});

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

  modelValue.value = model.getField(fieldPath.value, field.value.default);
});

const errors = computed(() => shared.errorMessages(fieldPath.value));
const hasError = computed(() => errors.value.length > 0 && !props.isReadOnly);

const inputRef = ref<HTMLInputElement | null>(null);
const newTag = ref('');

watch(newTag, (value: string) => {
  if (value.endsWith(',')) {
    const cleanValue = value.slice(0, -1).trim();
    const isOK = addTag(cleanValue);
    if (!isOK) newTag.value = cleanValue;
  }
});

const addTag = (value: string): boolean => {
  const parsed = parseReference(value);
  if (parsed === '') return false;
  if (modelValue.value.includes(parsed)) return false;
  if (isFull.value) return false;

  model.setField(fieldPath.value, [...modelValue.value, parsed]);
  newTag.value = '';
  return true;
};

const removeTag = (tag: string) => {
  const newTags = modelValue.value.filter((t: string) => t !== tag);
  model.setField(fieldPath.value, newTags);
};

const isFull = computed(() => {
  if (!field.value.allowMany) return modelValue.value.length > 0;
  return false;
});
</script>
