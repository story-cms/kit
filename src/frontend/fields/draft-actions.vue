<template>
  <button
    type="button"
    :class="['action-button', shared.showMetaBox ? 'active' : 'bg-white']"
    @click.prevent="shared.setShowMetaBox(!shared.showMetaBox)"
  >
    <Icon name="info" class="action-icon" />
  </button>
  <button
    v-if="shared.meta.hasAppPreview && !$page?.url?.includes('page')"
    type="button"
    :class="['action-button', shared.showAppPreview ? 'active' : 'bg-white']"
    @click.prevent="shared.setShowAppPreview(!shared.showAppPreview)"
  >
    <Icon name="mobile" class="action-icon" />
  </button>
  <button
    v-if="canDelete"
    type="button"
    class="bg-white action-button"
    @click="emit('delete')"
  >
    <Icon name="trash" class="action-icon" />
  </button>
</template>

<script setup lang="ts">
import Icon from '../shared/icon.vue';
import { useSharedStore } from '../store';

defineProps({
  canDelete: {
    type: Boolean,
    default: true,
  },
});

const shared = useSharedStore();

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
