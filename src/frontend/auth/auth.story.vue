<template>
  <Story title="Auth Index" group="users">
    <Variant title="Index">
      <CreateAccount :meta="sharedProps.meta" email="john@doe.com" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import CreateAccount from './create-account.vue';
import { sharedProps } from '../test/mocks';
</script>
