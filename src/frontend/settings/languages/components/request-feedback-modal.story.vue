<template>
  <Story title="Request Feedback Modal" group="settings">
    <Variant title="Success">
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white"
        @click="showSuccess = true"
      >
        Show success
      </button>
      <RequestFeedbackModal
        :open="showSuccess"
        variant="success"
        contact-email="ops@example.com"
        @close="showSuccess = false"
      />
    </Variant>
    <Variant title="Error">
      <button class="rounded bg-red-500 px-4 py-2 text-white" @click="showError = true">
        Show error
      </button>
      <RequestFeedbackModal
        :open="showError"
        variant="error"
        contact-email="ops@example.com"
        @close="showError = false"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RequestFeedbackModal from './request-feedback-modal.vue';

const showSuccess = ref(false);
const showError = ref(false);
</script>
