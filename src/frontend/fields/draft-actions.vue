<template>
  <button
    type="button"
    :class="['action-button', drafts.showMetaBox ? 'active' : 'bg-white']"
    @click.prevent="drafts.toggleMetaBox()"
  >
    <Icon name="info" class="action-icon" />
  </button>
  <button
    v-if="shared.meta.hasAppPreview"
    type="button"
    :class="['action-button', drafts.showAppPreview ? 'active' : 'bg-white']"
    @click.prevent="drafts.toggleAppPreview()"
  >
    <Icon name="mobile" class="action-icon" />
  </button>
  <button type="button" class="bg-white action-button" @click="emit('delete')">
    <Icon name="trash" class="action-icon" />
  </button>
</template>

<script setup lang="ts">
import Icon from '../shared/icon.vue';
import { useSharedStore, useDraftsStore } from '../store';

const shared = useSharedStore();
const drafts = useDraftsStore();

const emit = defineEmits(['delete']);
</script>
<style lang="postcss" scoped>
.action-icon {
  @apply size-6 cursor-pointer text-gray-500;
}
.action-button {
  @apply grid size-10 cursor-pointer place-content-center rounded-full transition-all duration-200 ease-in-out hover:bg-gray-100;
}
</style>
