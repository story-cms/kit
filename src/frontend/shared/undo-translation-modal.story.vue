<template>
  <Story title="Undo Translation Modal" group="shared">
    <Variant title="Default">
      <button class="rounded-xl bg-blue-500 px-4 py-2 text-white" @click="open = true">
        Undo translation
      </button>
      <UndoTranslationModal
        :open="open"
        chapter-title="Hope has come"
        edit-url="/de/story/1/draft/3/edit"
        @close="open = false"
        @confirm="onConfirm"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UndoTranslationModal from './undo-translation-modal.vue';

const open = ref(false);

const onConfirm = () => {
  open.value = false;
};
</script>
