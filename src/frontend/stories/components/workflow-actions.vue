<template>
  <StudioButton
    v-if="showAutoTranslate && !isAutoTranslating"
    label="Auto translate"
    variant="tertiary"
    @click="emit('auto-translate')"
  >
    <Sparkles class="size-4" aria-hidden="true" />
  </StudioButton>
  <span
    v-if="showAutoTranslate && isAutoTranslating"
    class="inline-flex items-center gap-2 rounded-full bg-studio-lime px-6 py-3 font-dmsans text-[15px] font-semibold text-studio-forest"
  >
    <LoaderCircle class="size-4 animate-spin" aria-hidden="true" />
    Translation in progress
  </span>
  <StudioButton
    v-if="showRequestChangeButton"
    label="Request Change"
    variant="destructive"
    @click="emit('request-change')"
  />
  <StudioButton
    v-if="showSubmitButton"
    label="Submit"
    variant="primary"
    :disabled="widgets.isDirty"
    @click="emit('submit')"
  />
  <StudioButton
    v-if="showPublishButton"
    :label="publishLabel"
    variant="primary"
    :disabled="widgets.isDirty"
    @click="emit('publish')"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { LoaderCircle, Sparkles } from '@lucide/vue';
import StudioButton from '../../shared/studio-button.vue';
import { useWidgetsStore, useSharedStore, useDraftsStore } from '../../store';

const props = withDefaults(
  defineProps<{
    hasEditReview: boolean;
    showAutoTranslate?: boolean;
    isAutoTranslating?: boolean;
  }>(),
  {
    showAutoTranslate: false,
    isAutoTranslating: false,
  },
);

const emit = defineEmits(['auto-translate', 'publish', 'request-change', 'submit']);

const widgets = useWidgetsStore();
const shared = useSharedStore();
const drafts = useDraftsStore();

const showSubmitButton = computed(() => {
  if (shared.user.role === 'admin') return false;
  if (!props.hasEditReview) return false;

  return drafts.draft.status === 'started';
});

const showRequestChangeButton = computed(() => {
  if (!props.hasEditReview) return false;
  if (shared.user.role !== 'admin') return false;
  return drafts.draft.status === 'submitted';
});

const showPublishButton = computed(() => {
  if (!props.hasEditReview) return true;
  if (shared.user.role !== 'admin') return false;
  return true;
});

const publishLabel = computed(() =>
  drafts.lastPublished === '' ? 'Mark Ready' : 'Publish changes',
);
</script>
