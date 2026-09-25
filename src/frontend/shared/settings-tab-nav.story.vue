<template>
  <Story title="Settings Tab Nav" group="shared">
    <Variant title="Languages active">
      <SettingsTabNav active="languages" />
    </Variant>
    <Variant title="AI tokens active">
      <SettingsTabNav active="tokens" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import SettingsTabNav from './settings-tab-nav.vue';
</script>
