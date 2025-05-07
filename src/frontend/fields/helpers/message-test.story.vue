<template>
  <Story title="Message Center Page" group="users">
    <Variant title="Index">
      <MessageTest
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :stories="['John', 'Acts']"
        :ui-todo-count="sharedProps.uiTodoCount"
        :story-name="sharedProps.storyName"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MessageTest from './message-test.vue';
import { sharedProps } from '../../../frontend/test/mocks';
</script>
