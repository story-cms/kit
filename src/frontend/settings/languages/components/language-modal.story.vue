<template>
  <Story title="Language Modal" group="settings">
    <Variant title="Remove language confirmation">
      <button class="rounded bg-blue-500 px-4 py-2 text-white" @click="showRemove = true">
        Remove language
      </button>
      <LanguageModal
        :open="showRemove"
        title="Remove language"
        message="Are you sure you want to remove this language? All your unpublished translation work will be lost."
        @close="showRemove = false"
      >
        <template #actions>
          <PillButton label="Cancel" variant="gray" @click="showRemove = false" />
          <PillButton label="Remove" variant="red" @click="showRemove = false" />
        </template>
      </LanguageModal>
    </Variant>
    <Variant title="Request removal confirmation">
      <button class="rounded bg-blue-500 px-4 py-2 text-white" @click="showRequest = true">
        Request language deletion
      </button>
      <LanguageModal
        :open="showRequest"
        title="Remove language"
        message="Are you sure you want to request to remove this language? All your progress will be lost."
        @close="showRequest = false"
      >
        <template #actions>
          <PillButton label="Cancel" variant="gray" @click="showRequest = false" />
          <PillButton label="Request removal" variant="red" @click="showRequest = false" />
        </template>
      </LanguageModal>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LanguageModal from './language-modal.vue';
import PillButton from '../../../shared/pill-button.vue';

const showRemove = ref(false);
const showRequest = ref(false);
</script>
