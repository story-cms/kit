<template>
  <Story title="Message Center Page" group="shared">
    <Variant title="Index">
      <MessageTest
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :stories="['John', 'Acts']"
        :ui-todo-count="sharedProps.uiTodoCount"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MessageTest from './message-test.vue';
import { sharedProps } from './mocks';
</script>
