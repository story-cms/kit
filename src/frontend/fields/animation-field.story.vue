<template>
  <Story id="animation-field" title="Animation Field" group="widgets">
    <Variant title="Model with Attachment" :setup-app="loadData">
      <AnimationField :field="spec" />
      <ModelControl :model="objectModel" />
    </Variant>

    <Variant title="Model without attachment" :setup-app="loadData">
      <AnimationField :field="spec" />
      <ModelControl :model="modelBlankAnimation" />
    </Variant>

    <Variant title="Non Animation Upload" :setup-app="loadData">
      <AnimationField :field="nonAnimationSpec" />
      <ModelControl :model="modelBlankAnimation" />
    </Variant>

    <Variant title="Model with file attributes" :setup-app="loadData">
      <AnimationField :field="fileAttributesSpec" />
    </Variant>

    <Variant title="Error" :setup-app="loadData">
      <AnimationField
        :field="{
          name: 'success',
          label: 'Success celebration',
          widget: 'animation',
        }"
      />
      <template #controls>
        <ErrorControl :errors="objectErrors" />
      </template>
    </Variant>

    <Variant title="Read Only" :setup-app="loadData">
      <AnimationField
        :field="{
          name: 'success',
          label: 'Success celebration (readonly)',
          widget: 'animation',
        }"
        :is-read-only="true"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import AnimationField from './animation-field.vue';
import ErrorControl from '../test/error-control.vue';
import ModelControl from '../test/model-control.vue';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const loadData: StoryHandler = ({ variant }): void => {
  const store = useModelStore();
  const shared = useSharedStore();
  if (variant?.title === 'Model without attachment') {
    store.model = modelBlankAnimation;
    return;
  }
  if (variant?.title === 'Error') {
    shared.errors = objectErrors;
    return;
  }

  if (variant?.title === 'Read Only') {
    store.setSource({
      ...objectModel,
      success:
        'https://res.cloudinary.com/onesheep/raw/upload/v1685641667/cmsplayground/fnu2m4ogxi9wdhi91iqi.riv',
    });
    return;
  }
  store.model = objectModel;
};

const provider = {
  defaultPreset: 'cmsplayground',
  cloudName: 'onesheep',
};

const objectModel = {
  name: 'John',
  age: 30,
  success:
    'https://res.cloudinary.com/onesheep/raw/upload/v1685641667/cmsplayground/fnu2m4ogxi9wdhi91iqi.riv',
};

const modelBlankAnimation = {
  ...objectModel,
  success: '',
};

const objectErrors = {
  'bundle.name': ['required validation failed'],
  'bundle.notes': ['required validation failed'],
  'bundle.success': ['required validation failed'],
};

const spec = {
  name: 'success',
  label: 'Success celebration',
  widget: 'animation',
  uploadPreset: 'cmsplayground',
  provider: provider,
};

const fileAttributesSpec = {
  name: 'avatar',
  label: 'Success celebration',
  widget: 'animation',
  uploadPreset: 'cmsplayground',
  provider: provider,
  description: 'RIV only',
  extensions: ['.riv'],
  maxSize: 2000000,
};

const nonAnimationSpec = {
  name: 'avatar',
  label: 'Success celebration',
  widget: 'animation',
  uploadPreset: 'cmsplayground',
  provider: provider,
  description: 'SVG, PNG up to 2MB',
  extensions: ['.svg', '.png'],
  maxSize: 2000000,
};
</script>
