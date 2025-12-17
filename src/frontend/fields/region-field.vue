<template>
  <PillField
    v-bind="props"
    :pills="tags"
    :errors="errors"
    :input-value="newTag"
    :display-text="getRegionName"
    @remove="removeTag"
    @update:input-value="newTag = $event"
    @add="handleAdd"
    @keydown:enter="handleEnter"
    @keydown:arrow-down="navigateDown"
    @keydown:arrow-up="navigateUp"
    @keydown:escape="hideSuggestions"
    @input="showSuggestions"
    @focus="showSuggestions"
    @blur="handleBlur"
  >
    <template #dropdown>
      <div
        v-if="showDropdown && filteredRegions.length > 0 && !props.isReadOnly"
        class="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white py-1 shadow-lg"
      >
        <button
          v-for="(region, index) in filteredRegions"
          :key="region.code"
          type="button"
          :class="[
            'w-full px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ltr:text-left rtl:text-right',
            selectedIndex === index ? 'bg-gray-100' : '',
          ]"
          @click="selectRegion(region.code)"
          @mouseenter="selectedIndex = index"
          @keydown.enter.prevent="selectRegion(region.code)"
        >
          <span class="font-medium">{{ region.code }}</span>
          <span class="text-gray-600 ltr:ml-2 rtl:mr-2">{{ region.name }}</span>
        </button>
      </div>
    </template>
  </PillField>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FieldSpec } from '../../types';
import { useModelStore, useSharedStore } from '../store/index';
import { commonProps } from '../shared/helpers';
import PillField from './pill/pill-field.vue';
import { regions } from './pill/regions';

const props = defineProps({
  ...commonProps,
});

const model = useModelStore();
const shared = useSharedStore();
const newTag = ref('');
const showDropdown = ref(false);
const selectedIndex = ref(-1);
const isSelectingFromDropdown = ref(false);

const field = computed(() => props.field as FieldSpec);
const fieldPath = computed(() => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const modelValue = computed(() => {
  return props.isReadOnly
    ? model.getSourceField(fieldPath.value, '')
    : model.getField(fieldPath.value, '');
});

const filteredRegions = computed(() => {
  if (!newTag.value.trim()) return [];

  const searchTerm = newTag.value.toLowerCase().trim();

  if (searchTerm.length < 3) {
    return regions
      .filter(
        (region) =>
          !tags.value.includes(region.code) &&
          region.code.toLowerCase().includes(searchTerm),
      )
      .slice(0, 6);
  }
  return regions
    .filter(
      (region) =>
        !tags.value.includes(region.code) &&
        region.name.toLowerCase().includes(searchTerm),
    )
    .slice(0, 6);
});

const findRegionCode = (searchTerm: string): string | null => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return null;

  let region = regions.find(
    (r) => r.name?.toLowerCase() === term || r.code.toLowerCase() === term,
  );

  if (!region) {
    region = regions.find(
      (r) => r.name?.toLowerCase().includes(term) || r.code.toLowerCase().includes(term),
    );
  }

  return region?.code ?? null;
};

const getRegionName = (code: string): string => {
  const region = regions.find((r) => r.code === code);
  return region?.name ?? code;
};

const handleAdd = (value: string) => {
  // Prevent add if we're selecting from dropdown
  if (isSelectingFromDropdown.value) {
    isSelectingFromDropdown.value = false;
    return;
  }

  if (value.length === 0) return;
  const regionCode = findRegionCode(value);
  if (regionCode) {
    addTag(regionCode);
  } else {
    newTag.value = '';
  }
};

const addTag = (code: string) => {
  if (tags.value.includes(code)) return;
  const currentTags = [...tags.value, code];
  model.setField(fieldPath.value, currentTags.join(','));
  newTag.value = '';
  hideSuggestions();
};

const removeTag = (tag: string) => {
  const newTags = tags.value.filter((t: string) => t !== tag);
  model.setField(fieldPath.value, newTags.join(','));
};

const selectRegion = (code: string) => {
  addTag(code);
};

const showSuggestions = () => {
  if (!props.isReadOnly && newTag.value.trim()) {
    showDropdown.value = true;
    selectedIndex.value = -1;
  }
};

const hideSuggestions = () => {
  setTimeout(() => {
    showDropdown.value = false;
    selectedIndex.value = -1;
  }, 200);
};

const handleBlur = () => {
  hideSuggestions();
};

const handleEnter = (event: KeyboardEvent) => {
  if (
    showDropdown.value &&
    selectedIndex.value >= 0 &&
    filteredRegions.value[selectedIndex.value]
  ) {
    // Set flag to prevent handleAdd from processing
    isSelectingFromDropdown.value = true;
    // Select the region
    selectRegion(filteredRegions.value[selectedIndex.value].code);
    event.preventDefault();
    event.stopPropagation();
    return;
  }
};

const navigateDown = () => {
  if (!showDropdown.value || filteredRegions.value.length === 0) {
    showSuggestions();
    return;
  }
  selectedIndex.value = Math.min(
    selectedIndex.value + 1,
    filteredRegions.value.length - 1,
  );
};

const navigateUp = () => {
  if (!showDropdown.value || filteredRegions.value.length === 0) return;
  selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
};

watch(newTag, (value) => {
  if (value.trim() && !props.isReadOnly) {
    showDropdown.value = true;
    selectedIndex.value = -1;
  } else {
    showDropdown.value = false;
    selectedIndex.value = -1;
  }

  if (value.endsWith(',')) {
    const newValue = value.slice(0, -1).trim();
    const regionCode = findRegionCode(newValue);
    if (regionCode) {
      addTag(regionCode);
    } else {
      newTag.value = '';
    }
  }
});

const errors = computed(() => shared.errorMessages(fieldPath.value));

const tags = computed(() => {
  const tagString = modelValue.value;
  if (!tagString || typeof tagString !== 'string' || tagString.length === 0) return [];
  return tagString.split(',').map((t: string) => t.trim());
});
</script>
