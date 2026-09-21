<template>
  <Story title="Translation Token Estimate Modal" group="stories">
    <Variant title="Default">
      <button
        class="rounded-xl bg-blue-500 px-4 py-2 text-white"
        @click="showModal = true"
      >
        Auto translate
      </button>
      <TranslationTokenEstimateModal
        :open="showModal"
        source-locale="English"
        target-locale="German"
        :estimated-tokens-low="1200"
        :estimated-tokens-high="1800"
        :balance="5000"
        @close="showModal = false"
        @confirm="onConfirm"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TranslationTokenEstimateModal from './translation-token-estimate-modal.vue';

const showModal = ref(false);

const onConfirm = () => {
  showModal.value = false;
  alert('Translation started');
};
</script>
