<template>
  <LanguageModal :open="open" @close="emit('close')">
    <div class="flex items-center gap-4">
      <div class="flex size-12 items-center justify-center rounded-xl border border-gray-200">
        <Languages class="size-5 text-studio-forest" aria-hidden="true" />
      </div>
      <h2 class="text-left font-dmsans text-lg font-semibold leading-[130%] text-black">
        Translation Token Estimate
      </h2>
    </div>

    <p class="mt-6 text-left font-dmsans text-base font-normal leading-7 text-black">
      Preparing to translate <strong>{{ sourceLocale }}</strong> content blocks to
      <strong>{{ targetLocale }}</strong
      >. This automatic process will use translation tokens based on the current
      character length.
    </p>

    <div class="mt-6 rounded-xl border border-gray-200 px-5 py-4">
      <div class="flex items-center justify-between border-b border-gray-200 pb-4">
        <span class="font-dmsans text-sm text-gray-500">Estimated cost</span>
        <span class="font-dmsans text-base font-semibold text-black">
          {{ estimatedTokensLow.toLocaleString() }} – {{ estimatedTokensHigh.toLocaleString() }}
          tokens
        </span>
      </div>
      <div class="flex items-center justify-between pt-4">
        <span class="font-dmsans text-sm text-gray-500">Your current balance</span>
        <span class="flex items-center gap-2 font-dmsans text-base font-semibold text-green-600">
          <span class="size-2 rounded-full bg-green-500" aria-hidden="true" />
          {{ balance.toLocaleString() }} tokens
        </span>
      </div>
    </div>

    <template #actions>
      <div class="mt-9 flex w-full justify-end gap-x-4">
        <StudioButton label="Cancel" variant="tertiary" @click="emit('close')" />
        <StudioButton
          label="Start Translation"
          variant="primary"
          :disabled="isTranslating"
          @click="emit('confirm')"
        >
          <Languages class="size-4" aria-hidden="true" />
        </StudioButton>
      </div>
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import { Languages } from '@lucide/vue';
import LanguageModal from '../../settings/languages/components/language-modal.vue';
import StudioButton from '../../shared/studio-button.vue';

withDefaults(
  defineProps<{
    open: boolean;
    sourceLocale: string;
    targetLocale: string;
    estimatedTokensLow: number;
    estimatedTokensHigh: number;
    balance: number;
    isTranslating?: boolean;
  }>(),
  {
    isTranslating: false,
  },
);

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();
</script>
