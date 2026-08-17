<template>
  <chapter-draft-edit-shell v-bind="props">
    <template #details>
      <devotion-draft-edit-details :chapter-type="props.story.chapterType" />
    </template>
    <template #blocks="{ blocks, updateBlocks }">
      <devotion-draft-edit-blocks
        :blocks="blocks"
        :previous-chapter-blocks="props.previousChapterBlocks ?? []"
        :video-collection-id="props.config.videoCollectionId"
        :chapter-type="props.story.chapterType"
        @update:blocks="updateBlocks"
      />
    </template>
  </chapter-draft-edit-shell>
</template>

<script setup lang="ts">
import type { DevotionDraftEditProps, SharedPageProps } from '../../types';
import ChapterDraftEditShell from './components/chapter-draft-edit-shell.vue';
import DevotionDraftEditBlocks from './components/devotion-draft-edit-blocks.vue';
import DevotionDraftEditDetails from './components/devotion-draft-edit-details.vue';

const props = defineProps<DevotionDraftEditProps & SharedPageProps>();
</script>
