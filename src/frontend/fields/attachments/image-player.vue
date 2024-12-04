<template>
  <img v-if="url != ''" :src="url" class="h-48 w-auto rounded-md" />
</template>

<script setup lang="ts">
defineProps({
  url: {
    type: String,
    required: true,
  },
});
</script>
