<template>
  <Teleport to="body">
    <Dialog :open="open" class="relative z-50" @close="emit('close')">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          class="relative z-10 max-w-80 overflow-hidden rounded-2xl bg-white p-4 shadow-xl"
        >
          <div class="grid grid-cols-[1fr_auto] items-start gap-4">
            <DialogTitle class="text-left text-sm font-semibold leading-5 text-[#101828]">
              {{ title }}
            </DialogTitle>
            <button
              type="button"
              class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close"
              @click="emit('close')"
            >
              <X class="size-4" aria-hidden="true" />
            </button>
          </div>

          <div class="mt-6 space-y-4">
            <slot v-if="$slots.default" />
            <template v-else>
              <div v-for="section in sections" :key="section.title" class="space-y-1">
                <p class="leading-5 tracking-[-0.15px] text-[#4A5565]">
                  <span class="font-bold"> {{ section.title }}: </span>
                  <span class="font-normal"> {{ section.description }}</span>
                </p>
              </div>
              <p v-if="message" class="text-sm leading-6 text-gray-600">{{ message }}</p>
            </template>
          </div>

          <p v-if="footer" class="mt-6 text-xs leading-4 text-[#6A7282]">
            {{ footer }}
          </p>
        </DialogPanel>
      </div>
    </Dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { X } from '@lucide/vue';
import type { LabelHintSection } from '../../types';

withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    message?: string;
    sections?: LabelHintSection[];
    footer?: string;
  }>(),
  {
    message: '',
    sections: () => [],
    footer: '',
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>
