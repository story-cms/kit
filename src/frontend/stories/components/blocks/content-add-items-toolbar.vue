<template>
  <div class="mt-6 space-y-3">
    <div class="flex flex-wrap gap-3">
      <DashedAddButton :dashed="false" :full-width="false" @click="$emit('addImage')">
        <Plus class="size-4" aria-hidden="true" />
        <Image class="size-4" aria-hidden="true" />
        <span>Image</span>
      </DashedAddButton>
      <DashedAddButton :dashed="false" :full-width="false" @click="$emit('addVideo')">
        <Plus class="size-4" aria-hidden="true" />
        <Video class="size-4" aria-hidden="true" />
        <span>Video</span>
      </DashedAddButton>
      <DashedAddButton :dashed="false" :full-width="false" @click="$emit('addScripture')">
        <Plus class="size-4" aria-hidden="true" />
        <BookMarked class="size-4" aria-hidden="true" />
        <span>Scripture</span>
      </DashedAddButton>
    </div>
    <AddLeadersNotesButton v-if="showAddLeadersNotes" @click="$emit('addLeadersNotes')" />
  </div>
</template>

<script setup lang="ts">
import { BookMarked, Image, Plus, Video } from '@lucide/vue';

import AddLeadersNotesButton from './add-leaders-notes-button.vue';
import DashedAddButton from './dashed-add-button.vue';

withDefaults(
  defineProps<{
    showAddLeadersNotes?: boolean;
  }>(),
  {
    showAddLeadersNotes: true,
  },
);

defineEmits<{
  addImage: [];
  addVideo: [];
  addScripture: [];
  addLeadersNotes: [];
}>();
</script>
