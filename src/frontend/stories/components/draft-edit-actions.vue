<template>
  <div class="flex flex-col flex-wrap items-start gap-1 md:flex-row md:items-center">
    <DraftActions @delete="emit('delete')" />
    <WorkflowActions
      :has-edit-review="hasEditReview"
      :show-auto-translate="showAutoTranslate"
      @auto-translate="emit('auto-translate')"
      @publish="emit('publish')"
      @request-change="emit('request-change')"
      @submit="emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
import DraftActions from '../../shared/draft-actions.vue';
import WorkflowActions from './workflow-actions.vue';

withDefaults(
  defineProps<{
    hasEditReview: boolean;
    showAutoTranslate?: boolean;
  }>(),
  {
    showAutoTranslate: false,
  },
);

const emit = defineEmits(['auto-translate', 'delete', 'publish', 'request-change', 'submit']);
</script>
