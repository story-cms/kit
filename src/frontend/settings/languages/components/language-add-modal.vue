<template>
  <LanguageModal :open="open" title="Adding languages" @close="emit('close')">
    <div class="space-y-4">
      <p class="text-center text-sm text-black">
        You're adding the following languages:
      </p>
      <ul
        class="flex flex-col items-center gap-2"
        :class="{
          'max-h-96 overflow-y-auto': languages.length > 10,
        }"
      >
        <li
          v-for="language in languages"
          :key="language.locale"
          class="text-base font-semibold leading-7 text-black"
        >
          {{ language.language }}
        </li>
      </ul>
      <div class="space-y-1 text-center text-base font-normal leading-7 text-black">
        <p>These languages will appear in your language list.</p>
        <p>
          You can now assign these languages to Team members to begin translating.
        </p>
      </div>
    </div>

    <template #actions>
      <PillButton label="Back" variant="gray" @click="emit('back')" />
      <PillButton label="Add" variant="green" @click="emit('add')" />
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import PillButton from '../../../shared/pill-button.vue';
import LanguageModal from './language-modal.vue';
import type { LanguageSpecification } from '../../../../types';

defineProps<{
  open: boolean;
  languages: LanguageSpecification[];
}>();

const emit = defineEmits<{
  close: [];
  back: [];
  add: [];
}>();
</script>
