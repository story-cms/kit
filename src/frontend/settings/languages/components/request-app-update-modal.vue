<template>
  <LanguageModal :open="open" title="App update request" @close="emit('close')">
    <div class="pb-8">
      <p
        class="pt-2 text-left font-['Inter'] text-base font-semibold leading-7 tracking-normal text-black"
      >
        What's the reason for the app update?
      </p>
      <p
        class="pt-2 text-left font-['Inter'] text-base font-normal leading-7 tracking-normal text-black"
      >
        Please select all that apply.
      </p>
      <div class="mt-6">
        <fieldset>
          <legend class="sr-only">Reasons</legend>
          <div class="space-y-[1px]">
            <div
              class="flex gap-3 rounded-t-lg border p-4"
              :class="
                selectedReasons.includes('New language')
                  ? 'border-indigo-200 bg-indigo-50'
                  : 'border-gray-200'
              "
            >
              <div class="flex h-6 shrink-0 items-center">
                <div class="group grid size-4 grid-cols-1">
                  <input
                    id="language"
                    v-model="selectedReasons"
                    type="checkbox"
                    name="language"
                    value="New language"
                    aria-describedby="language-description"
                    class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:!border-indigo-600 checked:!bg-indigo-600 checked:[background-image:none] indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                  />
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="opacity-0 group-has-[:checked]:opacity-100"
                    />
                    <path
                      d="M3 7H11"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="opacity-0 group-has-[:indeterminate]:opacity-100"
                    />
                  </svg>
                </div>
              </div>
              <div class="text-sm/6">
                <label
                  for="language"
                  class="font-['Inter'] text-sm font-semibold leading-[130%] tracking-normal"
                  :class="
                    selectedReasons.includes('New language')
                      ? 'text-blue-900'
                      : 'text-gray-900'
                  "
                  >New language</label
                >
                <p
                  id="language-description"
                  class="font-['Inter'] text-sm font-normal leading-5 tracking-normal"
                  :class="
                    selectedReasons.includes('New language')
                      ? 'text-blue-700'
                      : 'text-gray-500'
                  "
                >
                  Select this option if you have added a new language.
                </p>
              </div>
            </div>
            <div
              class="flex gap-3 rounded-b-lg border p-4"
              :class="
                selectedReasons.includes('New content')
                  ? 'border-indigo-200 bg-indigo-50'
                  : 'border-gray-200'
              "
            >
              <div class="flex h-6 shrink-0 items-center">
                <div class="group grid size-4 grid-cols-1">
                  <input
                    id="content"
                    v-model="selectedReasons"
                    type="checkbox"
                    name="content"
                    value="New content"
                    aria-describedby="content-description"
                    class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:!border-indigo-600 checked:!bg-indigo-600 checked:[background-image:none] indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                  />
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="opacity-0 group-has-[:checked]:opacity-100"
                    />
                    <path
                      d="M3 7H11"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="opacity-0 group-has-[:indeterminate]:opacity-100"
                    />
                  </svg>
                </div>
              </div>
              <div class="text-sm/6">
                <label
                  for="content"
                  class="font-['Inter'] text-sm font-semibold leading-[130%] tracking-normal"
                  :class="
                    selectedReasons.includes('New content')
                      ? 'text-blue-900'
                      : 'text-gray-900'
                  "
                  >New content</label
                >
                <p
                  id="content-description"
                  class="font-['Inter'] text-sm font-normal leading-5 tracking-normal"
                  :class="
                    selectedReasons.includes('New content')
                      ? 'text-blue-700'
                      : 'text-gray-500'
                  "
                >
                  Select this option if you've added new content.
                </p>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>

    <template #actions>
      <div class="flex w-full justify-end">
        <PillButton
          label="Confirm"
          variant="green"
          :disabled="selectedReasons.length === 0"
          @click="confirm"
        />
      </div>
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import LanguageModal from './language-modal.vue';
import PillButton from '../../../shared/pill-button.vue';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [reasons: string[]];
}>();

const selectedReasons = ref<string[]>([]);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) selectedReasons.value = [];
  },
);

const confirm = () => {
  if (selectedReasons.value.length === 0) return;

  emit('confirm', [...selectedReasons.value]);
  emit('close');
};
</script>
