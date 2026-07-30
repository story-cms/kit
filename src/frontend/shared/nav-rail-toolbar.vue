<template>
  <div
    :class="[
      'flex',
      variant === 'panel' ? 'justify-between p-5' : 'flex-col gap-y-3 p-2',
    ]"
  >
    <a :class="['nav-icon']" :href="`/${locale}/dashboard`">
      <Home class="size-6" aria-hidden="true" />
    </a>
    <button class="nav-icon" @click="goBack">
      <Reply class="size-6" aria-hidden="true" />
    </button>
    <NavRailLanguageSelector
      v-if="variant === 'pill' && subscribed('language')"
      v-model="shared.language.language"
      variant="pill"
      :current-locale="locale"
      :languages="sidebarLanguages"
      :is-read-only="!shared.user.isManager"
      @change="onLanguage"
    />
    <button class="nav-icon" @click="toggleMenu">
      <ChevronsRight v-if="variant === 'pill'" class="size-6" aria-hidden="true" />
      <ChevronsLeft v-else class="size-6" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ChevronsLeft, ChevronsRight, Home, Reply } from '@lucide/vue';
import NavRailLanguageSelector from './nav-rail-language-selector.vue';
import { useSidebarNav } from './use-sidebar-nav';

defineProps<{
  variant: 'pill' | 'panel';
}>();

const { shared, locale, sidebarLanguages, subscribed, goBack, toggleMenu, onLanguage } =
  useSidebarNav();
</script>

<style lang="postcss" scoped>
.nav-icon {
  @apply flex size-14 items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:bg-gray-100;
}
</style>
