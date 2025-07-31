<template>
  <Story title="Toggle Button" group="shared" :layout="{ type: 'grid', width: 300 }">
    <Variant title="Default">
      <ToggleButton
        icon-on="sort-asc"
        icon-off="sort"
        label="Toggle"
        :is-on="one"
        :is-active="false"
        @toggle="one = !one"
      />
    </Variant>
    <Variant title="Active">
      <ToggleButton
        icon-on="sort-asc"
        icon-off="sort"
        label="Toggle"
        :is-on="two"
        :is-active="true"
        @toggle="two = !two"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ToggleButton from './toggle-button.vue';
const one = ref(false);
const two = ref(false);
</script>
