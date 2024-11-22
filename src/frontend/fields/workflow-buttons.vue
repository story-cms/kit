<template>
  <button
    v-if="showRequestChangeButton"
    type="submit"
    class="w-32 rounded-[38px] border border-red-500 bg-red-500 px-[15px] py-[9px] text-sm/5 font-medium text-white shadow"
    @click.prevent="emit('request-change')"
  >
    Request Change
  </button>
  <button
    v-if="showSubmitButton"
    :disabled="widgets.isDirty"
    type="submit"
    class="w-32 rounded-[38px] border px-[15px] py-[9px] text-sm/5 font-medium text-white shadow focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset]"
    :class="{
      'bg-gray-400 opacity-80 hover:bg-gray-400 hover:shadow-none active:opacity-80':
        widgets.isDirty,
      'bg-blue-500 hover:bg-blue-400': !widgets.isDirty,
    }"
    @click.prevent="emit('submit')"
  >
    Submit
  </button>

  <button
    v-if="showPublishButton"
    type="submit"
    :disabled="widgets.isDirty"
    class="w-32 rounded-[38px] border px-[15px] py-[9px] text-sm/5 font-medium text-white shadow focus:outline-none focus:ring focus:ring-indigo-500 active:[box-shadow:_0px_2px_4px_0px_rgba(0,_0,_0,_0.15)_inset]"
    :class="{
      'bg-gray-400 opacity-80 hover:bg-gray-400 hover:shadow-none active:opacity-80':
        widgets.isDirty,
      'bg-green-500 hover:bg-green-400': !widgets.isDirty,
    }"
    @click.prevent="emit('publish')"
  >
    Publish
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useWidgetsStore, useSharedStore, useDraftsStore } from '../store';

const widgets = useWidgetsStore();
const shared = useSharedStore();
const drafts = useDraftsStore();

const emit = defineEmits(['publish', 'request-change', 'submit']);

const showSubmitButton = computed(() => {
  if (shared.user.role === 'admin') return false;
  if (!shared.meta.hasEditReview) return false;

  return drafts.draft.status === 'started';
});

const showRequestChangeButton = computed(() => {
  if (!shared.meta.hasEditReview) return false;
  if (shared.user.role !== 'admin') return false;
  return drafts.draft.status === 'submitted';
});

const showPublishButton = computed(() => {
  if (!shared.meta.hasEditReview) return true;
  if (shared.user.role !== 'admin') return false;
  return true;
});
</script>
