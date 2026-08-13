<template>
  <div class="mt-6 space-y-3">
    <div class="flex flex-wrap gap-3">
      <ChapterDashedAddButton :dashed="false" :full-width="false" @click="$emit('addImage')">
        <Plus class="size-4" aria-hidden="true" />
        <Image class="size-4" aria-hidden="true" />
        <span>Image</span>
      </ChapterDashedAddButton>
      <ChapterDashedAddButton :dashed="false" :full-width="false" @click="$emit('addVideo')">
        <Plus class="size-4" aria-hidden="true" />
        <Video class="size-4" aria-hidden="true" />
        <span>Video</span>
      </ChapterDashedAddButton>
      <ChapterDashedAddButton :dashed="false" :full-width="false" @click="$emit('addScripture')">
        <Plus class="size-4" aria-hidden="true" />
        <BookMarked class="size-4" aria-hidden="true" />
        <span>Scripture</span>
      </ChapterDashedAddButton>
    </div>
    <ChapterAddLeadersNotesButton
      v-if="showAddLeadersNotes"
      @click="$emit('addLeadersNotes')"
    />
  </div>
</template>

<script setup lang="ts">
import { BookMarked, Image, Plus, Video } from '@lucide/vue';

import ChapterAddLeadersNotesButton from './chapter-add-leaders-notes-button.vue';
import ChapterDashedAddButton from './chapter-dashed-add-button.vue';

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
