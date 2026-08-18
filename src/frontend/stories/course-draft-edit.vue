<template>
  <chapter-draft-edit-shell v-bind="props">
    <template #details>
      <course-draft-edit-details
        :chapter-type="props.story.chapterType"
        :image-collection-id="props.config.imageCollectionId"
      />
    </template>
    <template #blocks="{ blocks, updateBlocks }">
      <course-draft-edit-blocks
        :blocks="blocks"
        :previous-chapter-blocks="props.previousChapterBlocks ?? []"
        :video-collection-id="props.config.videoCollectionId"
        :image-collection-id="props.config.imageCollectionId"
        :chapter-type="props.story.chapterType"
        :template="props.story.template"
        @update:blocks="updateBlocks"
      />
    </template>
  </chapter-draft-edit-shell>
</template>

<script setup lang="ts">
import type { CourseDraftEditProps, SharedPageProps } from '../../types';
import ChapterDraftEditShell from './components/chapter-draft-edit-shell.vue';
import CourseDraftEditBlocks from './components/course-draft-edit-blocks.vue';
import CourseDraftEditDetails from './components/course-draft-edit-details.vue';

const props = defineProps<CourseDraftEditProps & SharedPageProps>();
</script>
