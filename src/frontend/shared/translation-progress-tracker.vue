<template>
  <TranslationProgressTrackerCard :jobs="tracker.jobs" @undo="tracker.undo" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useTranslationTrackerStore } from '../store/translation-tracker';
import TranslationProgressTrackerCard from './translation-progress-tracker-card.vue';

const tracker = useTranslationTrackerStore();

onMounted(() => {
  tracker.subscribe();
});

onUnmounted(() => {
  tracker.unsubscribe();
});
</script>
