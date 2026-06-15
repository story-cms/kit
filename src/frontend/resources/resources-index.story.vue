<template>
  <Story title="Resources index page" group="resources">
    <Variant title="Index" :setup-app="miniSidebar">
      <ResourcesIndex
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :resources="mockIndexResources"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourcesIndex from './resources-index.vue';
import { sharedProps, miniSidebar, mockIndexResources } from '../test/mocks';
</script>
