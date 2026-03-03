<template>
  <Story title="Request App Update Modal" group="settings">
    <Variant title="Open">
      <button
        class="rounded bg-green-500 px-4 py-2 text-white"
        @click="show = true"
      >
        Request App Update
      </button>
      <RequestAppUpdateModal
        :open="show"
        @close="show = false"
        @confirm="onConfirm"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RequestAppUpdateModal from './request-app-update-modal.vue';

const show = ref(true);

const onConfirm = (reason: string) => {
  alert(`Confirm request: ${reason}`);
  show.value = false;
};
</script>
