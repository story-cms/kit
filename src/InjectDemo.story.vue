<script setup>
import InjectDemo from './InjectDemo.vue'
</script>

<template>
  <Story>
    <Variant title="global">
      <InjectDemo />
    </Variant>

    <Variant
      title="local"
      :setupApp="
        ({ app }) => {
          app.provide('test', 'histoire')
        }
      "
    >
      <InjectDemo />
    </Variant>
  </Story>
</template>
