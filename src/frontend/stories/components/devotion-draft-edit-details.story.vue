<template>
  <Story title="Devotion Draft Edit Details" group="stories">
    <Variant title="Create" :setup-app="loadCreate">
      <DevotionDraftEditDetails chapter-type="Day" />
      <ModelControl :model="emptyChapterModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Populated" :setup-app="loadPopulated">
      <DevotionDraftEditDetails chapter-type="Day" />
      <ModelControl :model="populatedChapterModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Episode chapter type" :setup-app="loadPopulated">
      <DevotionDraftEditDetails chapter-type="Episode" />
      <ModelControl :model="populatedChapterModel" :is-inspect-only="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import DevotionDraftEditDetails from './devotion-draft-edit-details.vue';
import ModelControl from '../../test/model-control.vue';
import { useModelStore } from '../../store';
import type { StoryHandler } from '../../shared/helpers';

const emptyChapterModel = {
  number: '',
  title: '',
  description: '',
  coverImage: '',
  devotionAudio: '',
};

const populatedChapterModel = {
  number: '01',
  title: 'Is there more to life than this?',
  description: 'An introduction to the Christian faith.',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  devotionAudio: '',
};

const loadCreate: StoryHandler = (): void => {
  useModelStore().setModel(emptyChapterModel);
};

const loadPopulated: StoryHandler = (): void => {
  useModelStore().setModel(populatedChapterModel);
};
</script>

<docs lang="md">
# Devotion Draft Edit Details

Fixed metadata fields for the Details tab on devotion draft edit pages. Field labels use the story chapter type (e.g. Day Number, Episode Title).
</docs>
