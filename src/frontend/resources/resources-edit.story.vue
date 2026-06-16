<template>
  <Story title="Resource edit" group="resources">
    <Variant title="New resource" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockNewResourceEdit"
      />
    </Variant>

    <Variant title="Edit video" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockEditVideoResource"
      />
    </Variant>

    <Variant title="Edit text" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockEditTextResource"
      />
    </Variant>

    <Variant title="Edit info link" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockEditInfoLinkResource"
      />
    </Variant>

    <Variant title="With errors" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="mockResourceEditErrors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockNewResourceEdit"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourcesEdit from './resources-edit.vue';
import {
  sharedProps,
  miniSidebar,
  mockNewResourceEdit,
  mockEditVideoResource,
  mockEditTextResource,
  mockEditInfoLinkResource,
  mockResourceEditErrors,
} from '../test/mocks';
</script>
