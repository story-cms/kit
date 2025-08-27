<template>
  <Story title="Message Center Page" group="shared">
    <Variant title="Index">
      <MessageTest
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MessageTest from './message-test.vue';
import { sharedProps } from './mocks';
</script>
