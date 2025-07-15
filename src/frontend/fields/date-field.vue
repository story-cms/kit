<template>
  <VueDatePicker
    v-model="date"
    :inline="{ input: true }"
    text-input
    auto-apply
    :enable-time-picker="enableTimePicker"
    time-picker-inline
    :is-24="false"
    position="center"
    :six-weeks="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const date = ref(new Date());

defineProps({
  enableTimePicker: {
    type: Boolean,
    default: false,
  },
});
</script>
