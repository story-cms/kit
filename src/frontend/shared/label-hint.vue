<template>
  <div class="flex items-center gap-1.5">
    <span class="input-label" :class="{ 'text-gray-600': muted }">
      {{ label }}
    </span>
    <button
      v-if="hasPopup"
      type="button"
      class="inline-flex shrink-0 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      :aria-label="`More information about ${label}`"
      @click="isOpen = true"
    >
      <Info class="size-4" aria-hidden="true" />
    </button>

    <LabelHintPopup
      :open="isOpen"
      :title="popupTitle || label"
      :message="hint"
      :sections="sections"
      :footer="footer"
      @close="isOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Info } from '@lucide/vue';
import type { LabelHintSection } from '../../types';
import LabelHintPopup from './label-hint-popup.vue';

const props = withDefaults(
  defineProps<{
    label: string;
    popupTitle?: string;
    hint?: string;
    sections?: LabelHintSection[];
    footer?: string;
    muted?: boolean;
  }>(),
  {
    popupTitle: '',
    hint: '',
    sections: () => [],
    footer: '',
  },
);

const isOpen = ref(false);

const hasPopup = computed(
  () => Boolean(props.hint) || props.sections.length > 0 || Boolean(props.footer),
);
</script>
