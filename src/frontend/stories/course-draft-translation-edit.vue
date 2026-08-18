<template>
  <chapter-draft-edit-shell v-bind="props" is-translation>
    <template #details>
      <course-draft-edit-details
        :chapter-type="props.story.chapterType"
        :image-collection-id="props.config.imageCollectionId"
        :is-translation="true"
      />
    </template>
    <template #blocks="{ blocks, updateBlocks }">
      <course-draft-edit-blocks
        :blocks="blocks"
        :video-collection-id="props.config.videoCollectionId"
        :image-collection-id="props.config.imageCollectionId"
        :chapter-type="props.story.chapterType"
        :template="props.story.template"
        :is-translation="true"
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
