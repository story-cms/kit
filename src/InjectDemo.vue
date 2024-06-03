<script setup>
import { inject } from 'vue'

const injected = inject('test')

defineExpose({
  injected,
})
</script>

<template>
  <pre>{{ { injected } }}</pre>
</template>
