<template>
  <details
    v-for="(_listItem, index) in listItems"
    :key="index"
    class="my-2 p-2"
    :open="isExpanded(index)"
  >
    <summary>
      <div
        class="flex items-center justify-between"
        :class="{ 'opacity-0': props.isReadOnly }"
      >
        <span
          class="inline-flex cursor-pointer items-center rounded-full border border-gray-300 bg-white px-4 py-1.5"
          @click.prevent="toggle(index)"
        >
          <icon
            name="chevron-down"
            class="icon mr-1 transition-transform duration-200"
            aria-hidden="true"
          />
          <span>
            {{ String(sectionTitle(index)) }}
          </span>
        </span>
        <button
          v-if="canMutate"
          type="button"
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white text-gray-500"
          :disabled="props.isReadOnly"
          @click="emit('removeSet', index)"
        >
          <span class="flex h-10 w-10 items-center justify-center">
            <Icon name="trash" class="h-auto w-auto" />
          </span>
        </button>
      </div>
    </summary>
    <ul>
      <li v-for="(item, i) in fields" :key="item.name + `${i.toString()}`" class="grid">
        <component
          :is="widgets.picker(item.widget)"
          :class="{
            'rounded border border-gray-200 bg-white drop-shadow-sm':
              item.widget != 'list',
            'mt-8 rounded border border-gray-200 bg-white p-8 shadow': isIsland(
              item.widget,
            ),
          }"
          :field="item"
          :is-read-only="props.isReadOnly"
          :root-path="`${fieldPath}.${index.toString()}`"
          :is-nested="true"
        />
      </li>
    </ul>
  </details>

  <div v-if="canMutate" class="flex items-center gap-4">
    <AddItemButton :label="field.label" @add="emit('addSet')" />
    <div v-if="showEmptyListWarning()">
      <div class="flex flex-row items-center rounded-full border bg-white p-2 text-error">
        <Icon name="exclamation" class="pr-2" />
        <p class="text-sm">At least one item is required</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { FieldSpec } from '../../../types';
import Icon from '../../shared/icon.vue';
import { useModelStore, useWidgetsStore, useSharedStore } from '../../store';
import AddItemButton from '../../shared/add-item-button.vue';

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
const model = useModelStore();
const widgets = useWidgetsStore();
const shared = useSharedStore();

const canMutate = computed(() => {
  if (props.isReadOnly) return false;

  return !shared.isTranslation;
});

const isIsland = (type: string): boolean => {
  const singleWidgets = ['string', 'number', 'markdown', 'image', 'boolean', 'select'];
  return singleWidgets.includes(type);
};

widgets.setListToggles(props.fieldPath, [true, true, true, true, true]);
const toggleState = computed(() => widgets.getListToggles(props.fieldPath));

const isExpanded = (index: number): boolean => {
  return toggleState.value[index];
};

const toggle = (index: number) => {
  const fresh = toggleState.value;
  fresh[index] = !fresh[index];

  widgets.setListToggles(props.fieldPath, fresh);
};

const sectionTitle = (index: number): string => {
  const peek = title(index);
  return `${field.value.label} : ${peek}`;
};

const title = (index: number): string => {
  let path = `${props.fieldPath}.${index.toString()}`;
  if (field.value.index) {
    path = `${path}.${field.value.index}`;
  } else {
    path = `${path}.${fields[0].name}`;
  }
  const itemTitle = model.getField(path, 'New Section') as string;

  return itemTitle.length > 20 ? `${itemTitle.substring(0, 20)}...` : itemTitle;
};

const itemHasError = (index: number): boolean => {
  if (props.isReadOnly) return false;
  for (const key in shared.errors) {
    const needle = `bundle.${props.fieldPath}.${index}`;
    if (key.startsWith(needle)) return true;
  }
  return false;
};

const showEmptyListWarning = (): boolean => {
  if (props.isReadOnly) return false;
  if (props.listItems.length > 0) return false;

  for (const key in shared.errors) {
    const needle = `bundle.${props.fieldPath}`;
    if (key.startsWith(needle)) return true;
  }
  return false;
};

const borderWidth = computed(() => {
  if (shared.showSourceColumn) return `${shared.headerWidth - 30}px`;
  return '100%';
});
</script>

<style scoped>
summary::marker,
:is(::-webkit-details-marker) {
  content: ' ';
}

/* Rotate chevron when details is open */
details:open .icon {
  transform: rotate(270deg);
}
</style>
