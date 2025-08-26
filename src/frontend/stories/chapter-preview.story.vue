<template>
  <Story title="Preview" group="stories">
    <Variant title="Minimal" :setup-app="miniSidebar">
      <ChapterPreview
        :meta="sharedProps.meta"
        :user="user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
        :story="story"
        :chapter="meta"
        :bundle="{}"
        bundle-view="<h2>Rendered bundle goes here...</h2>"
        title="Let us start here"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { sharedProps, user, story, miniSidebar } from '../test/mocks';
import ChapterPreview from './chapter-preview.vue';

const meta = {
  number: 1,
  createdAt: '2023-10-04 15:50:45.587+03',
  updatedAt: '2023-10-18 11:24:49.216+03',
};
</script>
