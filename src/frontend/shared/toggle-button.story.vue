<template>
  <Story title="Toggle Button" group="shared" :layout="{ type: 'grid', width: 300 }">
    <Variant title="Default">
      <ToggleButton
        icon-on="dots-horizontal"
        icon-off="sort"
        label="Toggle"
        :is-on="isOn"
        @toggle="isOn = !isOn"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ToggleButton from './toggle-button.vue';
const isOn = ref(false);
</script>
