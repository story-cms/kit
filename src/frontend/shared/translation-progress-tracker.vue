<template>
  <TranslationProgressTrackerCard
    :jobs="tracker.jobs"
    :current-draft-id="currentDraftId"
    @undo="tracker.undo"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { useTranslationTrackerStore } from '../store/translation-tracker';
import TranslationProgressTrackerCard from './translation-progress-tracker-card.vue';

const tracker = useTranslationTrackerStore();
const page = usePage();

// Only present on standard-chapter-edit pages; absent everywhere else.
const currentDraftId = computed(
  () => (page.props?.draft as { id?: number } | undefined)?.id ?? null,
);

onMounted(() => {
  tracker.subscribe();
});

onUnmounted(() => {
  tracker.unsubscribe();
});
</script>
