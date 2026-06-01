<template>
  <Story title="Remove Language Modal" group="settings">
    <Variant title="Default">
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white"
        @click="showModal = true"
      >
        Remove language
      </button>
      <RemoveLanguageModal
        :open="showModal"
        @close="showModal = false"
        @confirm="onConfirm"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RemoveLanguageModal from './remove-language-modal.vue';

const showModal = ref(false);

const onConfirm = () => {
  showModal.value = false;
  alert('Language removed');
};
</script>
