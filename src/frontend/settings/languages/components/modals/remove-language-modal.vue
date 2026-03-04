<template>
  <LanguageModal
    :open="open"
    title="Remove language"
    message="Are you sure you want to remove this language? All your unpublished translation work will be lost."
    @close="emit('close')"
  >
    <template #actions>
      <PillButton label="Cancel" variant="gray" @click="emit('close')" />
      <PillButton label="Remove" variant="red" @click="emit('confirm')" />
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import LanguageModal from '../language-modal.vue';
import PillButton from '../../../../shared/pill-button.vue';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();
</script>
