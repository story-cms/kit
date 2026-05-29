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
        class="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white px-6 py-9 shadow-xl"
        role="document"
        @click.stop
      >
        <div
          class="items-center"
          :class="hideCloseButton ? '' : 'grid grid-cols-[1fr_auto]'"
        >
          <span
            v-if="title"
            id="modal-title"
            class="text-left font-['Inter']"
            :class="variantClass"
          >
            {{ title }}
          </span>
          <div v-if="!hideCloseButton" class="justify-self-end">
            <button
              type="button"
              class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
              @click="emit('close')"
            >
              <Icon name="close" class="size-4" />
            </button>
          </div>
        </div>

        <div class="mt-6">
          <slot>
            <p
              v-if="message"
              class="text-left font-['Inter'] text-base font-normal leading-7 tracking-normal text-black"
            >
              {{ message }}
            </p>
          </slot>
        </div>

        <div v-if="$slots.actions" class="flex justify-center gap-4">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted, computed } from 'vue';
import Icon from '../../../shared/icon.vue';

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

onUnmounted(() => document.removeEventListener('keydown', handleEscape));
</script>
