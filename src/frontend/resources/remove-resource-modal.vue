<template>
  <LanguageModal
    :open="open"
    title="Remove resource"
    message="Are you sure you want to delete this resource? This action cannot be undone."
    @close="emit('close')"
  >
    <template #actions>
      <div class="mt-9 flex w-full justify-end gap-x-4">
        <StudioButton label="Delete" variant="red" @click="emit('confirm')" />
        <StudioButton label="Cancel" variant="gray" @click="emit('close')" />
      </div>
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import LanguageModal from '../settings/languages/components/language-modal.vue';
import StudioButton from '../shared/studio-button.vue';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();
</script>
