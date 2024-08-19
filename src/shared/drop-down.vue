<template>
  <Listbox v-model="model" as="div">
    <div class="relative min-w-full">
      <ListboxButton
        :disabled="isReadOnly"
        class="relative w-32 cursor-default rounded-md border border-gray-300 py-2 pl-3 pr-10 text-left text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-1 sm:text-sm"
        :class="{ 'bg-gray-100': isReadOnly, 'bg-white': !isReadOnly }"
      >
        <span class="block truncate">{{ model }}</span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <Icon
            v-if="!isReadOnly"
            class="h-5 w-5 text-gray-700"
            aria-hidden="true"
            name="chevron-down"
          />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
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
                <Icon class="h-5 w-5" aria-hidden="true" name="check-simple" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { toRef, PropType } from 'vue';
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
