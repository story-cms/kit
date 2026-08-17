<template>
  <Story title="Course Draft Edit Details" group="stories">
    <Variant title="Session">
      <CourseDraftEditDetails chapter-type="Session" />
    </Variant>

    <Variant title="With model" :setup-app="loadData">
      <CourseDraftEditDetails chapter-type="Session" />
    </Variant>

    <Variant title="Translation" :setup-app="loadTranslation">
      <CourseDraftEditDetails chapter-type="Session" :is-translation="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import CourseDraftEditDetails from './course-draft-edit-details.vue';
import { useModelStore } from '../../store';
import type { StoryHandler } from '../../shared/helpers';
import {
  emptyCourseDraftBundle,
  sampleCourseDraftSourceBundle,
  sampleCourseDraftTranslationBundle,
} from '../../test/mocks';

const loadData: StoryHandler = (): void => {
  useModelStore().setModel(emptyCourseDraftBundle);
};

const loadTranslation: StoryHandler = (): void => {
  const store = useModelStore();
  store.setModel({ ...sampleCourseDraftTranslationBundle });
  store.setSource({ ...sampleCourseDraftSourceBundle });
};
</script>
