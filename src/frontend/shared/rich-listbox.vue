<template>
  <Listbox
    :model-value="modelValue"
    :disabled="isReadOnly"
    as="div"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="relative">
      <ListboxLabel
        v-if="label"
        class="mb-2 block text-sm font-medium text-gray-700"
        :class="{ 'text-gray-600': isReadOnly }"
      >
        {{ label }}
      </ListboxLabel>

      <ListboxButton
        class="control-rounded relative w-full cursor-default border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        :class="{ 'bg-gray-100': isReadOnly }"
      >
        <div v-if="selectedOption" class="flex items-center gap-3">
          <component
            :is="selectedOption.icon"
            class="size-5 shrink-0 text-gray-500"
            aria-hidden="true"
          />
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ selectedOption.label }}</p>
            <p class="truncate text-sm text-gray-500">{{ selectedOption.description }}</p>
          </div>
        </div>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <Icon
            v-if="!isReadOnly"
            class="size-5 text-gray-400"
            aria-hidden="true"
            name="chevron-down"
          />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="control-rounded absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="option in options"
            :key="option.value"
            v-slot="{ active, selected }"
            as="template"
            :value="option.value"
          >
            <li
              :class="[
                selected ? 'bg-blue-50' : active ? 'bg-gray-50' : 'bg-white',
                'relative cursor-default select-none py-3 pl-3 pr-10',
              ]"
            >
              <div class="flex items-center gap-3">
                <component
                  :is="option.icon"
                  class="size-5 shrink-0 text-gray-500"
                  aria-hidden="true"
                />
                <div class="min-w-0">
                  <p
                    :class="[
                      selected ? 'font-medium text-gray-900' : 'font-medium text-gray-900',
                    ]"
                  >
                    {{ option.label }}
                  </p>
                  <p class="text-sm text-gray-500">{{ option.description }}</p>
                </div>
              </div>
              <span
                v-if="selected"
                class="absolute inset-y-0 right-0 flex items-center pr-4"
              >
                <span class="size-2 rounded-full bg-blue-500" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component, PropType } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import Icon from './icon.vue';

export type RichListboxOption = {
  value: string;
  label: string;
  description: string;
  icon: Component;
};

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array as PropType<RichListboxOption[]>,
    required: true,
  },
  isReadOnly: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue),
);
</script>
