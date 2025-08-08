<template>
  <Story title="Draft Page" group="stories">
    <Variant title="Index">
      <DraftIndex
        :draft="draft"
        :bundle="bundle"
        :fields="fields"
        :chapter-limit="21"
        :last-published="'2021-10-10T14:48:00.000000Z'"
        :providers="{}"
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :story-name="'John'"
        :stories="['John', 'Acts']"
        :ui-todo-count="sharedProps.uiTodoCount"
        :story-id="1"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import DraftIndex from './draft-index.vue';
import { sharedProps, listSpec, listModel } from '../test/mocks';

const fields = [
  { name: 'title', label: 'Title', widget: 'string' },
  { name: 'date', label: 'Date', widget: 'date' },
  {
    widget: 'panel',
    isRow: true,
    fields: [
      {
        label: 'Cover Image',
        name: 'imageUrl',
        widget: 'image',
        uploadPreset: 'episodes',
        description: 'SVG, PNG, JPG, GIF up to 5MB',
        extensions: ['.jpeg', '.jpg', '.png', '.svg'],
        maxSize: 5662310,
      },
      {
        label: 'Animation File',
        name: 'animationUrl',
        widget: 'animation',
        uploadPreset: 'episodes',
        description: 'RIV only',
        extensions: ['.riv'],
        maxSize: 2000000,
      },
    ],
  },
  { ...listSpec },
  { name: 'image', label: 'Image', widget: 'image' },
  { name: 'description', label: 'Description', widget: 'string' },
  { name: 'body', label: 'Body', widget: 'markdown' },
  {
    name: 'nested',
    label: 'Nested',
    widget: 'object',
    fields: [
      { name: 'title', label: 'Title', widget: 'string' },
      { name: 'description', label: 'Description', widget: 'string' },
      { name: 'image', label: 'Image', widget: 'image' },
      { name: 'body', label: 'Body', widget: 'markdown' },
    ],
  },
];

const bundle = {
  title: 'The Word Became Flesh',
  imageUrl:
    'https://res.cloudinary.com/onesheep/image/upload/v1669793982/cld-sample-2.jpg',
  animationUrl:
    'https://res.cloudinary.com/onesheep/raw/upload/v1685641667/cmsplayground/fnu2m4ogxi9wdhi91iqi.riv',
  ...listModel,
  image: 'https://source.unsplash.com/random/800x600',
  description: 'We will look at the first chapter of the book of John.',
  body: '## The Word Became Flesh\n\nIn the beginning was the Word, and the Word was with God, and the Word was God. He was with God in the beginning. Through him all things were made; without him nothing was made that has been made. In him was life, and that life was the light of all mankind. The light shines in the darkness, and the darkness has not overcome it.',
  nested: {
    title: 'Verse 1 - 3',
    description: 'The first three verses',
    image: 'https://source.unsplash.com/random/800x600',
    body: 'A *lot* less things ...',
  },
};

const draft = {
  id: 1,
  number: 1,
  status: 'submitted',
  updatedAt: '2021-08-10T14:48:00.000000Z',
  createdAt: '2021-08-10T14:48:00.000000Z',
};
</script>
