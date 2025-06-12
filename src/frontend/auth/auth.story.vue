<template>
  <Story title="Auth Index" group="users">
    <Variant title="Index">
      <CreateAccount :meta="sharedProps.meta" email="john@doe.com" />
    </Variant>
    <Variant title="Login">
      <LoginIndex :meta="sharedProps.meta" />
    </Variant>
    <Variant title="Forgot Password">
      <ForgotPassword :meta="sharedProps.meta" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import CreateAccount from './create-account.vue';
import LoginIndex from './login-index.vue';
import ForgotPassword from './forgot-password.vue';
import { sharedProps } from '../test/mocks';
</script>
