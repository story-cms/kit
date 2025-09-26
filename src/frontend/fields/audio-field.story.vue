<template>
  <Story id="audio-field" title="Audio Field" group="widgets">
    <Variant title="Model without audio" :setup-app="loadData">
      <AudioField :field="spec" />
      <ModelControl :model="audioModelBlankAudio" />
    </Variant>

    <Variant title="Special target file path" :setup-app="loadData">
      <AudioField :field="spec" file-path="drafts/audio/day_01" />
      <ModelControl :model="audioModelBlankAudio" />
    </Variant>

    <Variant title="Model with audio" :setup-app="loadData">
      <AudioField :field="spec" />
      <ModelControl :model="audioModelBlankAudio" />
    </Variant>

    <Variant title="RTL" :setup-app="loadData">
      <AudioField dir="rtl" :field="spec" />
    </Variant>

    <Variant title="Error with audio" :setup-app="loadData">
      <AudioField :field="spec" />
      <template #controls>
        <ErrorControl :errors="audioObjectErrors" />
      </template>
    </Variant>

    <Variant title="Error without audio" :setup-app="loadData">
      <AudioField :field="spec" />
      <template #controls>
        <ErrorControl :errors="audioObjectErrors" />
      </template>
    </Variant>

    <Variant title="Nested" :setup-app="loadData">
      <PanelField :field="nested" />
    </Variant>

    <Variant title="Readonly" :setup-app="loadData">
      <AudioField :field="spec" :is-read-only="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import AudioField from './audio-field.vue';
import PanelField from './panel-field.vue';
import ErrorControl from '../test/error-control.vue';
import ModelControl from '../test/model-control.vue';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  switch (variant?.title) {
    case 'Model without audio':
    case 'Special target file path':
    case 'RTL':
      store.model = audioModelBlankAudio;
      return;

    case 'Error with audio':
      store.model = audioModel;
      shared.errors = audioObjectErrors;
      return;

    case 'Error without audio':
      store.model = audioModelBlankAudio;
      shared.errors = audioObjectErrors;
      return;

    case 'Readonly':
      store.setSource({
        ...audioModel,
        soundtrack: {
          url: 'https://res.cloudinary.com/redeem/video/upload/v1698150694/story-cms-ui/audio/297_CLASSIC_en-GB_be9mpu.mp3',
          length: 16.39,
        },
      });
      return;

    default:
      store.model = audioModel;
      break;
  }
};

const provider = {
  defaultPreset: 'cmsplayground',
  cloudName: 'onesheep',
};

const spec = {
  name: 'soundtrack',
  description: 'WAV, MP3, OGG, AAC, WMA',
  label: 'Audio file',
  extensions: ['.wav', '.mp3', '.ogg', '.aac', '.wma', '.m4a'],
  widget: 'audio',
  uploadPreset: 'cmsplayground',
  provider: provider,
  maxSize: 50662310,
  folder: 'audio',
};

const nested = {
  widget: 'panel',
  name: 'wrapper',
  label: '',
  fields: [
    { widget: 'string', name: 'name', label: 'Name' },
    { widget: 'number', name: 'age', label: 'Age' },
    spec,
  ],
};

const audioModel = {
  name: 'John',
  age: 30,
  soundtrack: {
    url: 'https://res.cloudinary.com/onesheep/video/upload/v1684307104/cmsplayground/hnjxjo6jj4octprgqyvq.mp3',
    length: 16.39,
  },
};

const audioModelBlankAudio = {
  name: 'John',
  age: 30,
  soundtrack: { url: null, length: null },
};

const audioObjectErrors = {
  'bundle.name': ['required validation failed'],
  'bundle.soundtrack': ['We could not publish the file. Please try again.'],
};
</script>
