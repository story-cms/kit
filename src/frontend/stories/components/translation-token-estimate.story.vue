<template>
  <Story title="Translation Token Estimate" group="stories" :layout="{ type: 'grid', width: 400 }">
    <Variant title="Loaded">
      <TranslationTokenEstimate :input-tokens="820" :output-tokens="1230" :balance="5000" />
    </Variant>
    <Variant title="Loading">
      <TranslationTokenEstimate
        :input-tokens="null"
        :output-tokens="null"
        :balance="5000"
        :is-estimating="true"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import TranslationTokenEstimate from './translation-token-estimate.vue';
</script>
