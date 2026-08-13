<template>
  <ChapterDashedAddButton @click="$emit('click')">
    <UserCog class="size-4" aria-hidden="true" />
    <span>Add Leader Notes</span>
  </ChapterDashedAddButton>
</template>

<script setup lang="ts">
import { UserCog } from '@lucide/vue';

import ChapterDashedAddButton from './chapter-dashed-add-button.vue';

defineEmits<{
  click: [];
}>();
</script>
