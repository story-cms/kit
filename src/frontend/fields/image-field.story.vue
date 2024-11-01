<template>
  <Story id="image-field" title="Image Field" group="widgets">
    <Variant title="Model with Image" :setup-app="loadData">
      <ImageField :field="spec" />
      <ModelControl :model="objectModel" />
    </Variant>

    <Variant title="Model without image" :setup-app="loadData">
      <ImageField :field="spec" />
      <ModelControl :model="objectModelBlankImage" />
    </Variant>

    <Variant title="Non Image Upload" :setup-app="loadData">
      <ImageField :field="nonImageSpec" />
      <ModelControl :model="objectModelBlankImage" />
    </Variant>

    <Variant title="Model with file attributes" :setup-app="loadData">
      <ImageField :field="fileAttributesSpec" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <ImageField
        :field="{
          name: 'profile',
          label: 'Profile Image',
          widget: 'image',
        }"
      />
      <template #controls>
        <ErrorControl :errors="objectErrors" />
      </template>
    </Variant>

    <Variant title="Read Only" :setup-app="loadData">
      <ImageField
        :field="{
          name: 'profile',
          label: 'Profile Image',
          widget: 'image',
        }"
        :is-read-only="true"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ImageField from './image-field.vue';
import ErrorControl from './helpers/error-control.vue';
import ModelControl from './helpers/model-control.vue';
import { objectErrors, objectModel, objectModelBlankImage } from './helpers/mocks';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  if (variant?.title === 'Read Only') {
    store.setSource({
      ...objectModel,
      profile:
        'https://res.cloudinary.com/redeem/image/upload/v1698125799/aaron-burden-c333d6YEhi0-unsplash_agmne9.jpg',
    });
    return;
  }
  if (variant?.title === 'Model without image') {
    store.model = objectModelBlankImage;
    return;
  }
  if (variant?.title === 'Error') {
    shared.errors = objectErrors;
    return;
  }
  store.model = objectModel;
};

const provider = {
  defaultPreset: 'cmsplayground',
  cloudName: 'onesheep',
};

const spec = {
  name: 'profile',
  label: 'Profile Image',
  widget: 'image',
  uploadPreset: 'cmsplayground',
  provider: provider,
};

const fileAttributesSpec = {
  name: 'avatar',
  label: 'Profile Image',
  widget: 'image',
  uploadPreset: 'cmsplayground',
  provider: provider,
  description: 'SVG, PNG up to 20KB',
  extensions: ['.svg', '.png'],
  maxSize: 20000,
};

const nonImageSpec = {
  name: 'avatar',
  label: 'Profile Image',
  widget: 'image',
  uploadPreset: 'cmsplayground',
  provider: provider,
  description: 'RIV only',
  extensions: ['.riv'],
  maxSize: 2000000,
};
</script>
