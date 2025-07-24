<template>
  <div class="bg-white p-10">
    <label :for="field.label" class="block text-sm/6 font-medium text-gray-900">{{
      field.label
    }}</label>
    <div class="mt-2 flex rounded-md border border-gray-300 bg-white p-1">
      <div
        class="flex flex-shrink-0 items-center gap-2 text-base text-gray-500 sm:text-sm/6"
        :class="tags.length > 0 ? 'px-3' : 'px-0'"
      >
        <span
          v-for="tag in tags"
          :key="tag"
          class="inline-flex flex-wrap items-center gap-1 rounded-full bg-[#E0F2FE] px-2 py-1 text-xs font-medium leading-4 text-blue-800"
        >
          {{ tag }}
          <button @click="onDelete(tag)">
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
        v-model="newTag"
        type="text"
        name="tags"
        class="block w-full grow rounded-r-md border-0 bg-white py-1 text-sm font-normal leading-5 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white"
        :class="tags.length > 0 ? '-ml-3' : ''"
        @keyup.enter="onUpdate(newTag)"
      />
    </div>
    <p v-if="errors.length > 0" class="text-sm text-error">{{ errors[0] }}</p>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, nextTick, onMounted } from 'vue';
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

const tagString = props.isReadOnly
  ? ref(model.getSourceField(fieldPath.value, ''))
  : ref(model.getField(fieldPath.value, ''));

const stringToTags = (tagString: string) => {
  return tagString.split(',').map((t: string) => t.trim());
};

model.$subscribe(() => {
  if (props.isReadOnly) return;

  nextTick().then(() => {
    const fresh = model.getField(fieldPath.value) as string;
    tagString.value = fresh;
    tags.value = stringToTags(fresh);
  });
});

const tags = ref<string[]>([]);

onMounted(() => {
  tags.value = stringToTags(tagString.value);
});
const newTag = ref('');

const onUpdate = (tag: string) => {
  const newTags = tag
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && !tags.value.includes(t));
  if (newTags.length > 0) {
    tags.value.push(...newTags);
    tagString.value = tags.value.join(',');
  }
  model.setField(fieldPath.value, tagString.value);
  newTag.value = '';
};

const onDelete = (tag: string) => {
  tags.value = tags.value.filter((t) => t !== tag);
  tagString.value = tags.value.join(',');
  model.setField(fieldPath.value, tagString.value);
  nextTick().then(() => {
    tagString.value = model.getField(fieldPath.value) as string;
  });
};

const errors = computed(() => shared.errorMessages(fieldPath.value));
</script>
