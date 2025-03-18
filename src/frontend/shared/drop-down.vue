<template>
  <Listbox v-model="model" as="div">
    <div class="relative min-w-full">
      <ListboxButton
        :disabled="isReadOnly"
        class="relative w-32 py-2 pl-3 pr-10 text-sm text-left text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 sm:text-sm text-nowrap"
        :class="{ 'bg-gray-100': isReadOnly, 'bg-white': !isReadOnly }"
      >
        <span class="block truncate">{{ model }}</span>
        <span
          class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
        >
          <Icon
            v-if="!isReadOnly"
            class="w-5 h-5 text-gray-700"
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
          class="absolute z-10 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="option in options"
            :key="option"
            v-slot="{ active, value }"
            as="template"
            :value="option"
            @click="emit('change', option)"
          >
            <li
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'relative cursor-default select-none py-2 pl-3 pr-9',
              ]"
            >
              <span
                :class="[value ? 'font-semibold' : 'font-normal', 'block truncate']"
                >{{ option }}</span
              >

              <span
                v-if="value"
                :class="[
                  active ? 'text-white' : 'text-red-500/60',
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                ]"
              >
                <Icon class="w-5 h-5" aria-hidden="true" name="check-simple" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import type { PropType } from 'vue';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import Icon from './icon.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array as PropType<string[]>,
    required: true,
  },
  isReadOnly: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const model = toRef(props, 'modelValue');

const emit = defineEmits(['change']);
</script>
