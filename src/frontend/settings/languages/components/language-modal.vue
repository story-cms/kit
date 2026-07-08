<template>
  <Teleport to="body">
    <Dialog :open="open" class="relative z-50" @close="emit('close')">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          class="relative z-10 w-full max-w-xl overflow-hidden rounded-xl bg-white px-6 py-9 shadow-xl"
        >
          <div
            class="items-center"
            :class="hideCloseButton ? '' : 'grid grid-cols-[1fr_auto]'"
          >
            <DialogTitle v-if="title" class="text-left font-dmsans" :class="variantClass">
              {{ title }}
            </DialogTitle>
            <div v-if="!hideCloseButton" class="justify-self-end">
              <button
                type="button"
                class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
                @click="emit('close')"
              >
                <X class="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="mt-6">
            <slot>
              <p
                v-if="message"
                class="text-left font-dmsans text-base font-normal leading-7 tracking-normal text-black"
              >
                {{ message }}
              </p>
            </slot>
          </div>

          <div v-if="$slots.actions" class="flex justify-center gap-4">
            <slot name="actions" />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { X } from '@lucide/vue';
import { computed } from 'vue';

type ModalVariant = 'success' | 'error' | '';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    message?: string;
    variant?: ModalVariant;
    hideCloseButton?: boolean;
  }>(),
  {
    title: '',
    message: '',
    variant: '',
    hideCloseButton: false,
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const variantClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'text-xs leading-4 font-medium text-green-800 bg-green-200 py-1 px-[18px] rounded-full max-w-fit';
    case 'error':
      return 'text-xs leading-4 font-medium text-red-800 bg-red-100 py-1 px-[18px] rounded-full max-w-fit';
    default:
      return 'text-sm font-semibold leading-[130%] tracking-normal text-black';
  }
});
</script>
