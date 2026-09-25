<template>
  <LanguageModal :open="open" title="Request more tokens" @close="emit('close')">
    <p
      class="pt-2 text-left font-dmsans text-base font-normal leading-7 tracking-normal text-black"
    >
      We'll add more tokens to your central pool so you can keep allocating them to your
      languages. Our team will follow up with you shortly.
    </p>

    <template #actions>
      <div class="flex w-full justify-end">
        <StudioButton label="Send request" variant="primary" @click="confirm" />
      </div>
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import LanguageModal from '../../languages/components/language-modal.vue';
import StudioButton from '../../../shared/studio-button.vue';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const confirm = () => {
  emit('confirm');
  emit('close');
};
</script>
