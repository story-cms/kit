<template>
  <DashedAddButton @click="$emit('click')">
    <UserCog class="size-4" aria-hidden="true" />
    <span>Add Leader Notes</span>
  </DashedAddButton>
</template>

<script setup lang="ts">
import { UserCog } from '@lucide/vue';

import DashedAddButton from './dashed-add-button.vue';

defineEmits<{
  click: [];
}>();
</script>
