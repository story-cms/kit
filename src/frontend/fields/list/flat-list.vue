<template>
  <div
    v-for="(_listItem, index) in listItems"
    :key="index"
    role="listitem"
    class="grid my-8 space-y-8 bg-transparent"
  >
    <div class="px-8 pt-3 pb-8 ml-8 space-y-6 bg-gray-100 drop-shadow">
      <div
        v-if="canMutate"
        class="absolute right-0 mr-3 text-gray-500 cursor-pointer"
        @click="emit('removeSet', index)"
      >
        <Icon name="trash" class="w-10 h-10" />
      </div>
      <div v-for="(item, i) in fields" :key="item.name + `${i.toString()}`">
        <component
          :is="store.picker(item.widget)"
          :field="item"
          :is-read-only="props.isReadOnly"
          :root-path="`${fieldPath}.${index.toString()}`"
          :is-nested="true"
        />
      </div>
    </div>
  </div>
  <div v-if="canMutate" class="mt-8 ml-8 flex flex-row items-center gap-4">
    <AddItemButton :label="field.label" @add="emit('addSet')" />
    <div v-if="listNeedsItem()" class="cursor-pointer text-accent-one">
      <div class="p-2 bg-white border rounded-full flex flex-row items-center">
        <Icon name="exclamation" class="pr-2 text-red-500" />
        <p class="text-sm text-error">At least one item is required</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { FieldSpec } from '../../../types';
import Icon from '../../shared/icon.vue';
import AddItemButton from '../../shared/add-item-button.vue';
import { useWidgetsStore, useSharedStore } from '../../store';

const props = defineProps({
  field: {
    type: Object as PropType<FieldSpec>,
    required: true,
  },
  fieldPath: {
    type: String,
    required: true,
  },
  listItems: {
    type: Array,
    required: true,
  },
  isReadOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['addSet', 'removeSet']);
const field = computed(() => props.field as FieldSpec);
const fields = field.value.fields as FieldSpec[];
const store = useWidgetsStore();
const language = useSharedStore();

const canMutate = computed(() => {
  if (props.isReadOnly) return false;

  return !language.isTranslation;
});

const listNeedsItem = (): boolean => {
  if (props.isReadOnly) return false;
  let foundItem = false;
  for (const key in language.errors) {
    const needle = `bundle.${props.fieldPath}`;
    if (key.startsWith(needle)) {
      const remaining = key.slice(needle.length);
      if (remaining.startsWith('.') && /\d+/.test(remaining.slice(1))) {
        foundItem = true;
      }
    }
    if (!foundItem && props.listItems.length === 0) return true;
    return false;
  }
};
</script>
