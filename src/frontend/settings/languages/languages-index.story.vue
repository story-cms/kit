<template>
  <Story title="Languages Page" group="settings">
    <Variant title="Index" :setup-app="miniSidebar">
      <LanguagesIndex />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LanguagesIndex from './languages-index.vue';
import { miniSidebar } from '../../test/mocks';
</script>
