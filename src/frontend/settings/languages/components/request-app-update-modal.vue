<template>
  <LanguageModal :open="open" title="Request app update" @close="emit('close')">
    <div class="space-y-4 pb-[130px]">
      <p class="text-center text-base font-semibold leading-6 text-black">
        What would you like to update?
      </p>

      <Listbox v-model="selectedReason" as="div" class="relative">
        <ListboxButton
          class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-left text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <span class="block truncate">
            {{ selectedReason || 'Select reason' }}
          </span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <Icon name="chevron-down" class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-for="option in reasons"
              :key="option"
              v-slot="{ active, selected }"
              :value="option"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                ]"
              >
                <span
                  :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']"
                >
                  {{ option }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
                >
                  <Icon name="check" class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </Listbox>
    </div>

    <template #actions>
      <PillButton label="Confirm request" variant="green" @click="confirm" />
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import Icon from '../../../shared/icon.vue';
import LanguageModal from './language-modal.vue';
import PillButton from '../../../shared/pill-button.vue';

const reasons = ['New language', 'New content', 'Other'] as const;

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [reason: string];
}>();

const selectedReason = ref<string>('New language');

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) selectedReason.value = 'New language';
  },
);

const confirm = () => {
  emit('confirm', selectedReason.value);
  emit('close');
};
</script>
