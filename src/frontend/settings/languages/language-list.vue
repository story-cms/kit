<template>
  <div class="pb-11">
    <div
      class="grid grid-cols-1 gap-x-[30px] gap-y-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      <LanguageListItem
        v-for="item in items"
        :key="item.language.locale"
        :language="item.language"
        :status="item.status"
        class="w-full"
        @update="(isSelected) => emit('update', item.language.locale, isSelected)"
      />
    </div>
    <div v-if="items.length === 0" class="mt-10 flex justify-center">
      <div class="flex max-w-[600px] flex-col items-center justify-center">
        <svg
          width="54"
          height="54"
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.5122 20.25C19.7477 17.6283 23.0815 15.75 27.0001 15.75C31.9707 15.75 36.0001 18.7721 36.0001 22.5C36.0001 25.6487 33.1255 28.2939 29.2371 29.0398C28.0167 29.274 27.0001 30.2574 27.0001 31.5M27 38.25H27.0225M47.25 27C47.25 38.1838 38.1838 47.25 27 47.25C15.8162 47.25 6.75 38.1838 6.75 27C6.75 15.8162 15.8162 6.75 27 6.75C38.1838 6.75 47.25 15.8162 47.25 27Z"
            stroke="#9CA3AF"
            stroke-width="5.49609"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p class="pt-3 text-center text-xl font-semibold leading-8 text-black">
          Don’t see the language you’re looking for?
        </p>
        <p class="pt-8 text-center text-lg font-normal leading-8 text-black">
          You’re going to the ends of the earth! We couldn’t find that language in our
          system...yet. If you’d like us to add it, please contact us.
        </p>
        <PillButton
          label="Request Language"
          variant="blue"
          class="my-8"
          @click="handleRequestLanguage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LanguageListItemProps } from '../../../types';
import { useSharedStore } from '../../store';
import LanguageListItem from './components/language-list-item.vue';
import PillButton from '../../shared/pill-button.vue';

defineProps<{
  items: LanguageListItemProps[];
}>();

const emit = defineEmits<{
  update: [locale: string, isSelected: boolean];
}>();

const shared = useSharedStore();

const handleRequestLanguage = () => {
  const subject = `Request new language`;
  const body = `I would like to request the following language which is missing in Journeys Studio.`;
  window.location.href = `mailto:${shared.config.supportEmail}?subject=${subject}&body=${body}`;
};
</script>
