<template>
  <Story title="Resources index page" group="resources">
    <Variant title="With resources" :setup-app="miniSidebar">
      <ResourcesIndex
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :resources="mockIndexResources"
      />
    </Variant>

    <Variant title="Empty" :setup-app="miniSidebar">
      <ResourcesIndex
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :resources="emptyResources"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourcesIndex from './resources-index.vue';
import { sharedProps, miniSidebar, mockIndexResources } from '../test/mocks';
import type { ResourceIndexItem } from '../../types';

const emptyResources: ResourceIndexItem[] = [];
</script>

<docs lang="md">
# Resources index page

Resource library index with search, filters, grid/list views, and create action in the header.

## Variants

- **With resources** — populated library from `mockIndexResources`
- **Empty** — no resources; shows the modest empty state with heading and helper text
</docs>
