<template>
  <chapter-draft-edit-shell v-bind="props" :is-translation="props.isTranslation">
    <template #details="{ isTranslation: translationMode }">
      <chapter-draft-edit-details
        :chapter-type="props.story.chapterType"
        :image-collection-id="props.config.imageCollectionId"
        :audio-collection-id="props.config.audioCollectionId"
        :template="props.story.template"
        :is-translation="translationMode"
      />
    </template>
    <template #blocks="{ blocks, updateBlocks, isTranslation: translationMode }">
      <chapter-draft-edit-blocks
        :blocks="blocks"
        :previous-chapter-blocks="props.previousChapterBlocks ?? []"
        :video-collection-id="props.config.videoCollectionId"
        :image-collection-id="props.config.imageCollectionId"
        :chapter-type="props.story.chapterType"
        :template="props.story.template"
        :is-translation="translationMode"
        @update:blocks="updateBlocks"
      />
    </template>
  </chapter-draft-edit-shell>
</template>

<script setup lang="ts">
import type { ChapterDraftEditProps, SharedPageProps } from '../../types';
import ChapterDraftEditShell from './components/chapter-draft-edit-shell.vue';
import ChapterDraftEditBlocks from './components/chapter-draft-edit-blocks.vue';
import ChapterDraftEditDetails from './components/chapter-draft-edit-details.vue';

const props = withDefaults(defineProps<ChapterDraftEditProps & SharedPageProps>(), {
  isTranslation: false,
});
</script>
