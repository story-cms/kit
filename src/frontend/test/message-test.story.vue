<template>
  <Story title="Message Center Page" group="shared">
    <Variant title="Index">
      <MessageTest
        :errors="sharedProps.errors"
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :bookmarks="sharedProps.bookmarks"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MessageTest from './message-test.vue';
import { sharedProps } from './mocks';
</script>
