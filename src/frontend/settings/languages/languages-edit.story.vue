<template>
  <Story title="Languages Edit" group="settings">
    <Variant title="Edit" :setup-app="miniSidebar">
      <LanguagesEdit />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LanguagesEdit from './languages-edit.vue';
import { miniSidebar } from '../../test/mocks';
</script>
