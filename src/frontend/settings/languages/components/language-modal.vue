<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title ? 'modal-title' : undefined"
    >
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" @click="emit('close')" />
      <div
        class="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl"
        role="document"
        @click.stop
      >
        <div class="grid grid-cols-[1fr_auto] items-center">
          <h2
            v-if="title"
            id="modal-title"
            class="text-center text-base font-medium text-black"
          >
            {{ title }}
          </h2>
          <div class="justify-self-end">
            <button
              type="button"
              class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
              @click="emit('close')"
            >
              <Icon name="close" class="size-5" />
            </button>
          </div>
        </div>

        <div class="mt-6">
          <slot>
            <p v-if="message" class="text-center text-base font-normal leading-7 text-black">
              {{ message }}
            </p>
          </slot>
        </div>

        <div v-if="$slots.actions" class="mt-8 flex justify-center gap-4">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue';
import Icon from '../../../shared/icon.vue';

const props = defineProps<{
  open: boolean;
  title?: string;
  message?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) document.addEventListener('keydown', handleEscape);
    else document.removeEventListener('keydown', handleEscape);
  },
  { immediate: true },
);

onUnmounted(() => document.removeEventListener('keydown', handleEscape));
</script>
