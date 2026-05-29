<template>
  <LanguageModal :open="open" :title="title" :variant="variant" @close="$emit('close')">
    <div class="pb-6 pt-4">
      <p
        class="font-['Inter'] text-base font-semibold leading-7 tracking-normal text-black"
      >
        {{ heading }}
      </p>
      <p
        class="pt-[10px] font-['Inter'] text-base font-normal leading-7 tracking-normal text-black"
      >
        {{ message }}
      </p>
    </div>

    <template #actions>
      <div class="flex w-full justify-end">
        <PillButton label="Close" variant="blue" @click="$emit('close')" />
      </div>
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LanguageModal from './language-modal.vue';
import PillButton from '../../../shared/pill-button.vue';

const props = defineProps<{
  open: boolean;
  variant: 'success' | 'error';
  contactEmail: string;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const content = computed(() =>
  props.variant === 'success'
    ? {
        title: 'Confirmation',
        heading: 'Request sent',
        message: `Your request has been submitted. For any enquiries email ${props.contactEmail}`,
      }
    : {
        title: 'Error',
        heading: 'Request not received',
        message: `Your request has not been able to be processed. Please contact ${props.contactEmail} for further assistance.`,
      },
);

const title = computed(() => content.value.title);
const heading = computed(() => content.value.heading);
const message = computed(() => content.value.message);
</script>
