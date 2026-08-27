<template>
  <Story title="Standard Chapter Edit Details" group="stories">
    <Variant title="Course session" :setup-app="loadCourse">
      <StandardChapterEditDetails chapter-type="Session" template="course" />
    </Variant>

    <Variant title="Devotion day" :setup-app="loadDevotion">
      <StandardChapterEditDetails
        chapter-type="Day"
        template="devotion"
        :audio-collection-id="sharedProps.config.audioCollectionId"
      />
      <ModelControl :model="populatedDevotionModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Translation" :setup-app="loadTranslation">
      <StandardChapterEditDetails chapter-type="Session" template="course" :is-translation="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StandardChapterEditDetails from './standard-chapter-edit-details.vue';
import ModelControl from '../../test/model-control.vue';
import { useModelStore } from '../../store';
import type { StoryHandler } from '../../shared/helpers';
import {
  emptyCourseDraftBundle,
  sampleCourseDraftSourceBundle,
  sampleCourseDraftTranslationBundle,
  sharedProps,
} from '../../test/mocks';

const populatedDevotionModel = {
  number: '01',
  title: 'Is there more to life than this?',
  description: 'An introduction to the Christian faith.',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  devotionAudio: { url: null, length: null },
};

const loadCourse: StoryHandler = (): void => {
  useModelStore().setModel(emptyCourseDraftBundle);
};

const loadDevotion: StoryHandler = (): void => {
  useModelStore().setModel(populatedDevotionModel);
};

const loadTranslation: StoryHandler = (): void => {
  const store = useModelStore();
  store.setModel({ ...sampleCourseDraftTranslationBundle });
  store.setSource({ ...sampleCourseDraftSourceBundle });
};
</script>

<docs lang="md">
# Standard Chapter Edit Details

Shared details tab for standard chapter templates. Extra fields such as devotion
audio are shown from the template registry.
</docs>
