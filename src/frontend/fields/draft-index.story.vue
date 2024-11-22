<template>
  <Story title="Draft Page" group="draft">
    <Variant title="Index">
      <DraftIndex
        :draft="draft"
        :bundle="{
          id: 1,
          number: 1,
          status: 'submitted',
          updatedAt: '2021-08-10T14:48:00.000000Z',
          createdAt: '2021-08-10T14:48:00.000000Z',
        }"
        :spec="{
          name: 'John',
          chapterLimit: 21,
          fields: fields,
        }"
        :last-published="'2021-10-10T14:48:00.000000Z'"
        :providers="{}"
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :story-name="'John'"
        :stories="['John', 'Acts']"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import DraftIndex from './draft-index.vue';
import { listInListSpec, sharedProps } from '../test/mocks';

const fields = [
  { name: 'title', label: 'Title', widget: 'string' },
  { ...listInListSpec },
  { name: 'image', label: 'Image', widget: 'image' },
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

const draft = {
  id: 1,
  number: 1,
  status: 'submitted',
  updatedAt: '2021-08-10T14:48:00.000000Z',
  createdAt: '2021-08-10T14:48:00.000000Z',
};
</script>
