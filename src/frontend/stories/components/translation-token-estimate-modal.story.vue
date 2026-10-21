<template>
  <Story title="Translation Token Estimate Modal" group="stories">
    <Variant title="Loaded">
      <button
        class="rounded-xl bg-blue-500 px-4 py-2 text-white"
        @click="showLoadedModal = true"
      >
        Auto translate
      </button>
      <TranslationTokenEstimateModal
        :open="showLoadedModal"
        source-locale="English"
        target-locale="German"
        :input-tokens="820"
        :output-tokens="1230"
        :balance="5000"
        @close="showLoadedModal = false"
        @confirm="onConfirm"
      />
    </Variant>
    <Variant title="Loading">
      <button
        class="rounded-xl bg-blue-500 px-4 py-2 text-white"
        @click="showLoadingModal = true"
      >
        Auto translate
      </button>
      <TranslationTokenEstimateModal
        :open="showLoadingModal"
        source-locale="English"
        target-locale="German"
        :input-tokens="null"
        :output-tokens="null"
        :balance="5000"
        :is-estimating="true"
        @close="showLoadingModal = false"
        @confirm="onConfirm"
      />
    </Variant>
    <Variant title="Insufficient balance">
      <button
        class="rounded-xl bg-blue-500 px-4 py-2 text-white"
        @click="showInsufficientModal = true"
      >
        Auto translate
      </button>
      <TranslationTokenEstimateModal
        :open="showInsufficientModal"
        source-locale="English"
        target-locale="German"
        :input-tokens="820"
        :output-tokens="1230"
        :balance="0"
        @close="showInsufficientModal = false"
        @confirm="onConfirm"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TranslationTokenEstimateModal from './translation-token-estimate-modal.vue';

const showLoadedModal = ref(false);
const showLoadingModal = ref(false);
const showInsufficientModal = ref(false);

const onConfirm = () => {
  showLoadedModal.value = false;
  showLoadingModal.value = false;
  showInsufficientModal.value = false;
  alert('Translation started');
};
</script>
