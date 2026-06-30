<template>
  <Story title="Resource not found" group="resources">
    <Variant title="Default" :setup-app="miniSidebar">
      <ResourceNotFound
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourceNotFound from './resource-not-found.vue';
import { sharedProps, miniSidebar } from '../test/mocks';
</script>

<docs lang="md">
# Resource not found

Shown when a resource cannot be loaded (missing or not available in the current language).

## Variants

- **Default** — error message with a CTA back to the resource library
</docs>
