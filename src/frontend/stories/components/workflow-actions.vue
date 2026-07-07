<template>
  <StudioButton
    v-if="showRequestChangeButton"
    label="Request Change"
    variant="red"
    @click="emit('request-change')"
  />
  <StudioButton
    v-if="showSubmitButton"
    label="Submit"
    variant="blue"
    :disabled="widgets.isDirty"
    @click="emit('submit')"
  />
  <StudioButton
    v-if="showPublishButton"
    label="Publish"
    variant="green"
    :disabled="widgets.isDirty"
    @click="emit('publish')"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import StudioButton from '../../shared/studio-button.vue';
import { useWidgetsStore, useSharedStore, useDraftsStore } from '../../store';

const props = defineProps<{
  hasEditReview: boolean;
}>();

const emit = defineEmits(['publish', 'request-change', 'submit']);

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
</script>
