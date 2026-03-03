<template>
  <LanguageModal :open="open" :title="title" @close="$emit('close')">
    <div class="space-y-2 py-28 text-center">
      <p class="text-base font-semibold leading-6 text-black">
        {{ heading }}
      </p>
      <p class="text-base font-normal leading-7 text-black">
        {{ message }}
      </p>
      <p class="text-base font-normal leading-7 text-black">
        {{ contactText }}
      </p>
    </div>

    <template #actions>
      <PillButton label="Close" variant="blue" @click="$emit('close')" />
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LanguageModal from './language-modal.vue';
import PillButton from '../../../shared/pill-button.vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    variant: 'success' | 'error';
    contactEmail?: string;
  }>(),
  { contactEmail: 'ops@scoutredeem.co' },
);

defineEmits<{
  (e: 'close'): void;
}>();

const content = computed(() =>
  props.variant === 'success'
    ? {
        title: 'Confirmation',
        heading: 'Request sent',
        message: 'Your request has been submitted.',
        contactText: `For any enquiries email ${props.contactEmail}`,
      }
    : {
        title: 'Error',
        heading: 'Request not received',
        message: 'Your request has not been able to be processed',
        contactText: `Please contact ${props.contactEmail} for further assistance.`,
      },
);

const title = computed(() => content.value.title);
const heading = computed(() => content.value.heading);
const message = computed(() => content.value.message);
const contactText = computed(() => content.value.contactText);
</script>
