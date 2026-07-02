<template>
  <div
    :class="[
      'flex',
      variant === 'panel' ? 'justify-between p-5' : 'flex-col gap-y-3 p-2',
    ]"
  >
    <a :class="['nav-icon']" :href="`/${locale}/dashboard`">
      <Icon name="home" />
    </a>
    <button class="nav-icon" @click="goBack">
      <Icon name="reply" />
    </button>
    <div v-if="subscribed('language')">
      <button
        v-if="variant === 'panel'"
        class="relative flex size-14 items-center justify-center rounded-full transition-all duration-75"
      >
        <span
          class="absolute right-2 top-4 rounded-[7px] bg-blue-100 px-1 py-[2px] text-[8px] font-medium uppercase leading-[9.36px] text-blue-800"
        >
          {{ locale }}
        </span>
        <Icon name="translate" />
      </button>
      <LanguageSelector
        v-else
        :current-locale="locale"
        :current-language="shared.language.language"
        :languages="sidebarLanguages"
        :is-read-only="!shared.user.isManager"
        @language-change="onLanguage"
      />
    </div>
    <button class="nav-icon" @click="toggleMenu">
      <Icon v-if="variant === 'pill'" name="chevron-double-right" />
      <Icon v-else name="chevron-double-left" />
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from './icon.vue';
import LanguageSelector from './language-selector.vue';
import { useSidebarNav } from './use-sidebar-nav';

defineProps<{
  variant: 'pill' | 'panel';
}>();

const {
  shared,
  locale,
  sidebarLanguages,
  subscribed,
  goBack,
  toggleMenu,
  onLanguage,
} = useSidebarNav();
</script>

<style lang="postcss" scoped>
.nav-icon {
  @apply flex size-14 items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:bg-gray-100;
}
</style>
