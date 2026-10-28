<template>
  <Story title="Translation Lock Overlay" group="shared">
    <Variant title="Over a card">
      <div class="relative w-80 rounded-xl border border-gray-200 bg-white p-6">
        <p class="input-label">Chapter Title</p>
        <input class="input-field" value="Jesus is risen" disabled />
        <TranslationLockOverlay />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import TranslationLockOverlay from './translation-lock-overlay.vue';
</script>
