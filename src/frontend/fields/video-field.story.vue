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
  collectionId: 'adae5810-c13d-4f9a-b1f1-8780a57f6655', // kit collection
};

const fileAttributesSpec = {
  name: 'intro',
  label: 'Intro video',
  widget: 'video',
  description: 'MP4, AV1 up to 250MB',
  extensions: ['.mp4', '.av1'],
  maxSize: 250000000,
  collectionId: 'adae5810-c13d-4f9a-b1f1-8780a57f6655', // kit collection
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

<docs lang="md">
# Video Field

Holds a url to a hosted video file. Suitable for allowing content editors to upload video
files and renders a [VideoField](#). The video field uses bunny.net as a hosting and
streaming provider. The provider needs to be configured in the .env file with these keys:
`BUNNY_ACCESS_KEY`, `BUNNY_LIBRARY_ID`, `BUNNY_HOST` A video field has three special keys:

- `description` an optional message that will be displayed on the upload widget. Defaults
  to 'MP4 and MOV files up to 500MB'
- `extensions` an optional list of accepted file extensions. Defaults to '['.mp4',
  '.mov']'
- `maxSize` an optional number in bytes that a file should not exceed. Defaults to
  500662310
- `collectionId` an optional string that holds the id of the target collection in the
  video library

example:

```ts
{
  label: 'Feature',
  name: 'feature',
  widget: 'video'
},
```

VideoField with file attributes and a collection

```ts
{
  label: 'Video file',
  name: 'feature',
  widget: 'video',
  description: 'MP4, AV1',
  extensions: ['.mp4', '.av1'],
  maxSize: 150000000,
  collectionId: '3b08a34e-1f2d-4e80-8c36-7c315e7eb507'
},
```
</docs>
