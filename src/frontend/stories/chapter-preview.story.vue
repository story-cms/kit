<template>
  <Story title="Preview" group="stories">
    <Variant title="Minimal">
      <ChapterPreview
        :chapter="meta"
        :bundle="{}"
        bundle-view="<h2>Rendered bundle goes here...</h2>"
        story-name="John"
        :story-id="1"
        title="Let us start here"
        :chapter-limit="10"
        :meta="sharedProps.meta"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :stories="['John', 'Luke']"
        :user="{
          id: 1,
          name: 'Test User',
          initials: 'TU',
          email: 'test@example.com',
          isManager: false,
          isAdmin: false,
          role: 'user',
          language: 'en',
        }"
        :ui-todo-count="0"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { sharedProps } from '../test/mocks';
import ChapterPreview from './chapter-preview.vue';

const meta = {
  number: 1,
  createdAt: '2023-10-04 15:50:45.587+03',
  updatedAt: '2023-10-18 11:24:49.216+03',
};
</script>
