<template>
  <LanguageModal :open="open" title="Undo translation" @close="emit('close')">
    <p class="text-center font-dmsans text-base font-normal leading-7 text-gray-500">
      Are you sure you want to undo the translation? We will reset your content to what was
      there before your latest auto-translate but you won't get your tokens back.
    </p>

    <template #actions>
      <div class="mt-9 flex w-full flex-col items-center gap-3">
        <StudioButton
          label="Undo translation"
          variant="primary"
          full-width
          @click="emit('confirm')"
        />
        <a
          :href="editUrl"
          class="font-dmsans text-sm text-gray-500 underline"
          @click="emit('close')"
        >
          Take me back to {{ chapterTitle }}
        </a>
      </div>
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import LanguageModal from '../settings/languages/components/language-modal.vue';
import StudioButton from './studio-button.vue';

defineProps<{
  open: boolean;
  chapterTitle: string;
  editUrl: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();
</script>
