<template>
  <StandardChapterEditShell v-bind="props" :is-translation="props.isTranslation">
    <template #details="{ isTranslation: translationMode }">
      <StandardChapterEditDetails
        :chapter-type="props.story.chapterType"
        :image-collection-id="props.config.imageCollectionId"
        :audio-collection-id="props.config.audioCollectionId"
        :template="props.story.template"
        :is-translation="translationMode"
      />
    </template>
    <template #blocks="{ blocks, updateBlocks, isTranslation: translationMode }">
      <StandardChapterEditBlocks
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
  </StandardChapterEditShell>
</template>

<script setup lang="ts">
import type { StandardChapterEditProps, SharedPageProps } from '../../types';
import StandardChapterEditShell from './components/standard-chapter-edit-shell.vue';
import StandardChapterEditBlocks from './components/standard-chapter-edit-blocks.vue';
import StandardChapterEditDetails from './components/standard-chapter-edit-details.vue';

const props = withDefaults(defineProps<StandardChapterEditProps & SharedPageProps>(), {
  isTranslation: false,
});
</script>
