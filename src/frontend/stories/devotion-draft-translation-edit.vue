<template>
  <chapter-draft-edit-shell v-bind="props" is-translation>
    <template #details>
      <devotion-draft-edit-details
        :chapter-type="props.story.chapterType"
        :image-collection-id="props.config.imageCollectionId"
        :audio-collection-id="props.config.audioCollectionId"
        :is-translation="true"
      />
    </template>
    <template #blocks="{ blocks, updateBlocks }">
      <devotion-draft-edit-blocks
        :blocks="blocks"
        :video-collection-id="props.config.videoCollectionId"
        :image-collection-id="props.config.imageCollectionId"
        :chapter-type="props.story.chapterType"
        :is-translation="true"
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
