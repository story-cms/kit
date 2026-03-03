<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" @click="emit('close')" />
      <div
        class="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl"
        role="document"
        @click.stop
      >
        <div class="grid grid-cols-[1fr_auto]">
          <h2 id="modal-title" class="text-center text-base font-medium text-black">
            Adding languages
          </h2>
          <button
            type="button"
            class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
            @click="emit('close')"
          >
            <Icon name="close" class="size-5" />
          </button>
        </div>

        <div class="mt-6 space-y-4">
          <p class="text-center text-sm text-black">
            You're adding the following languages:
          </p>
          <ul
            class="flex flex-col items-center gap-2"
            :class="{
              'max-h-96 overflow-y-auto': languages.length > 10,
            }"
          >
            <li
              v-for="language in languages"
              :key="language.locale"
              class="text-base font-semibold leading-7 text-black"
            >
              {{ language.language }}
            </li>
          </ul>
          <div class="space-y-1 text-center text-base font-normal leading-7 text-black">
            <p>These languages will appear in your language list.</p>
            <p>
              You can now assign these languages to Team members to begin translating.
            </p>
          </div>
        </div>

        <div class="mt-8 flex justify-center gap-4">
          <PillButton label="Back" variant="gray" @click="emit('back')" />
          <PillButton label="Add" variant="green" @click="emit('add')" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue';
import Icon from '../../../shared/icon.vue';
import PillButton from '../../../shared/pill-button.vue';
import type { LanguageSpecification } from '../../../../types';

const props = defineProps<{
  open: boolean;
  languages: LanguageSpecification[];
}>();

const emit = defineEmits<{
  close: [];
  back: [];
  add: [];
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
