<template>
  <LanguageModal :open="open" hide-close-button @close="emit('close')">
    <div class="flex items-center gap-4">
      <div
        class="flex size-9 items-center justify-center rounded-xl border border-gray-200"
      >
        <Languages class="size-5 text-studio-forest" aria-hidden="true" />
      </div>
      <h2 class="text-left font-dmsans text-lg font-semibold leading-[130%] text-black">
        Translation Token Estimate
      </h2>
    </div>

    <p class="mt-6 text-left font-dmsans text-base font-normal leading-7 text-black">
      Preparing to translate <strong>{{ sourceLocale }}</strong> content blocks to
      <strong>{{ targetLocale }}</strong
      >. This automatic process will use translation tokens based on the current content.
    </p>

    <TranslationTokenEstimate
      class="mt-6"
      :input-tokens="inputTokens"
      :output-tokens="outputTokens"
      :balance="balance"
      :is-estimating="isEstimating"
    />

    <template #actions>
      <div class="mt-9 flex w-full justify-end gap-x-4">
        <StudioButton label="Cancel" variant="tertiary" @click="emit('close')" />
        <StudioButton
          label="Start Translation"
          variant="primary"
          :disabled="
            isTranslating ||
            isEstimating ||
            inputTokens === null ||
            outputTokens === null ||
            balance === null ||
            isInsufficient
          "
          @click="emit('confirm')"
        >
          <Languages class="size-4" aria-hidden="true" />
        </StudioButton>
      </div>
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Languages } from '@lucide/vue';
import LanguageModal from '../../settings/languages/components/language-modal.vue';
import StudioButton from '../../shared/studio-button.vue';
import TranslationTokenEstimate from './translation-token-estimate.vue';
import { hasSufficientBalance } from '../standard-chapter-edit-controller';

const props = withDefaults(
  defineProps<{
    open: boolean;
    sourceLocale: string;
    targetLocale: string;
    inputTokens: number | null;
    outputTokens: number | null;
    balance: number | null;
    isEstimating?: boolean;
    isTranslating?: boolean;
  }>(),
  {
    isEstimating: false,
    isTranslating: false,
  },
);

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const isInsufficient = computed(
  () =>
    !hasSufficientBalance(props.balance ?? 0, props.inputTokens ?? 0, props.outputTokens ?? 0),
);
</script>
