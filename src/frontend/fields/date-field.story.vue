<template>
  <Story title="Date Field" group="widgets">
    <Variant title="With time picker">
      <DateField :enable-time-picker="true" />
    </Variant>
    <Variant title="Without time picker">
      <DateField :enable-time-picker="false" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import DateField from './date-field.vue';
</script>
