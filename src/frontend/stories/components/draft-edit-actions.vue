<template>
  <div class="flex flex-col flex-wrap items-start gap-1 md:flex-row md:items-center">
    <p v-if="hasBeenSaved" class="mr-1 font-dmsans text-xs font-normal leading-5 text-gray-600">
      Last saved {{ lastSaved }}
    </p>
    <DraftActions @delete="emit('delete')" />
    <WorkflowActions
      :has-edit-review="hasEditReview"
      @publish="emit('publish')"
      @request-change="emit('request-change')"
      @submit="emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { DateTime } from 'luxon';
import { toRelativeTime } from '../../shared/helpers';
import DraftActions from '../../shared/draft-actions.vue';
import WorkflowActions from './workflow-actions.vue';
import { useDraftsStore } from '../../store';

defineProps<{
  hasEditReview: boolean;
}>();

const emit = defineEmits(['delete', 'publish', 'request-change', 'submit']);

const drafts = useDraftsStore();

const hasBeenSaved = computed(
  () => drafts.draft.updatedAt !== drafts.draft.createdAt,
);

const now = ref(DateTime.now());

const lastSaved = computed(() => toRelativeTime(drafts.draft.updatedAt, now.value));

watch(
  () => drafts.draft.updatedAt,
  () => {
    now.value = DateTime.now();
  },
);

const interval = setInterval(() => {
  now.value = DateTime.now();
}, 5000);

onUnmounted(() => clearInterval(interval));
</script>
