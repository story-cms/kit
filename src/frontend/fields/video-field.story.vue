<template>
  <Story id="video-field" title="Video Field" group="widgets">
    <Variant title="Model with Video" :setup-app="loadData">
      <VideoField :field="spec" />
      <ModelControl :model="videoModel" />
    </Variant>

    <Variant title="Model without video" :setup-app="loadData">
      <VideoField :field="spec" />
      <ModelControl :model="blankVideoModel" />
    </Variant>

    <Variant title="Model with file attributes" :setup-app="loadData">
      <VideoField :field="fileAttributesSpec" />
      <ModelControl :model="blankVideoModel" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <VideoField :field="spec" />
      <template #controls>
        <ErrorControl :errors="validationErrors" />
      </template>
    </Variant>

    <Variant title="Read Only" :setup-app="loadData">
      <VideoField :field="spec" :is-read-only="true" />
      <ModelControl :model="videoModel" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import VideoField from './video-field.vue';
import ErrorControl from '../test/error-control.vue';
import ModelControl from '../test/model-control.vue';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  if (variant?.title === 'Read Only') {
    store.setSource(videoModel);
    return;
  }

  if (variant?.title === 'Model without video') {
    store.model = blankVideoModel;
    return;
  }

  if (variant?.title === 'Model with file attributes') {
    store.model = blankVideoModel;
    return;
  }

  if (variant?.title === 'Error') {
    shared.errors = validationErrors;
    return;
  }

  store.model = videoModel;
};

const spec = {
  name: 'intro',
  label: 'Intro video',
  widget: 'video',
};

const fileAttributesSpec = {
  name: 'intro',
  label: 'Intro video',
  widget: 'video',
  description: 'MP4, AV1 up to 250MB',
  extensions: ['.mp4', '.av1'],
  maxSize: 250000000,
  collectionId: '3b08a34e-1f2d-4e80-8c36-7c315e7eb507',
};

const videoModel = {
  name: 'John',
  age: 30,
  intro: {
    url: 'https://vz-831b1d74-446.b-cdn.net/9c2b5fcb-df7e-411a-95f0-d5820393c87f/playlist.m3u8',
  },
};

const blankVideoModel = {
  name: 'John',
  age: 30,
  intro: { url: null },
};

const validationErrors = {
  'bundle.name': ['required validation failed'],
  'bundle.intro': ['We could not publish the file. Please try again.'],
};
</script>
