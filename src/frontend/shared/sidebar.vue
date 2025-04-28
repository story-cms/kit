<template>
  <aside
    :class="[
      'sticky max-w-[320px] bg-white shadow-md transition-all duration-75',
      shared.isLargeScreen
        ? 'top-0 max-h-screen rounded-r-[20px]'
        : 'top-3 mx-auto max-h-min rounded-full',
    ]"
  >
    <nav>
      <div
        :class="[
          'flex',
          shared.isLargeScreen ? 'justify-between p-5' : 'flex-col gap-y-3 p-2',
        ]"
      >
        <Link :class="['nav-icon', true ? 'active' : '']" href="/">
          <Icon name="home" />
        </Link>
        <button @click="goBack" class="nav-icon">
          <Icon name="reply" />
        </button>
        <button class="nav-icon relative">
          <span
            class="absolute right-2 top-4 rounded-[7px] bg-blue-100 px-1 py-[2px] text-[8px] font-medium uppercase leading-[9.36px] text-blue-800"
          >
            {{ currentLocale }}
          </span>
          <Icon name="translate" />
        </button>
        <button class="nav-icon" @click="toggleMenu">
          <Icon v-if="!shared.hasOpenSidebar" name="chevron-double-right" />
          <Icon v-else name="chevron-double-left" />
        </button>
      </div>
      <div :class="[shared.isLargeScreen ? 'mt-4 flex flex-col px-4' : 'hidden']">
        <section class="grid grid-cols-1">
          <div v-for="story in shared.stories" :key="story">
            <button
              :class="['nav-link', story === 'John' ? 'active' : '']"
              @click="onStory(story)"
            >
              {{ story }}
            </button>
          </div>
          <Link class="nav-link" href="/page">Pages</Link>
          <div v-if="isMultiLingual">
            <button
              v-if="currentLocale === 'en'"
              class="nav-link opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Interface
            </button>
            <Link v-else class="nav-link flex items-center justify-between" href="/ui"
              ><span>Interface</span>
              <span class="">24</span>
            </Link>
          </div>
        </section>
        <div class="my-7 border-t border-gray-200"></div>
        <section class="grid grid-cols-1">
          <Link class="nav-link flex items-center gap-x-3" href="/profile">
            <Icon name="user" />
            <span>Profile</span>
          </Link>
          <Link class="nav-link flex items-center gap-x-3" href="/profile">
            <Icon name="users" />
            <span>Users</span>
          </Link>
          <Link class="nav-link flex items-center gap-x-3" href="/profile">
            <Icon name="help" />
            <span>Help</span>
          </Link>
          <Link class="nav-link flex items-center gap-x-3" href="/profile">
            <Icon name="logout" />
            <span>Logout</span>
          </Link>
        </section>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSharedStore } from '../store';
import { Link, useForm } from '@inertiajs/vue3';

import Icon from '../shared/icon.vue';
import LanguageSelector from './language-selector.vue';

const shared = useSharedStore();

const form = useForm({
  language: shared.language.language as string,
  story: null,
});

const onLanguage = async (lang: string) => {
  if (lang === form.language) return;
  form.language = lang;
  form.story = null;
  form.post('/switch');
};

const onStory = async (story: string) => {
  form.story = story;
  form.language = null;
  form.post('/switch');
};

const signOut = () => {
  window.location.href = '/logout';
};

const isMultiLingual = computed(() => shared.languages.length > 1);

const isAdmin = computed(() => shared.user.isAdmin);

const currentLocale = computed(() => {
  return shared.languages.find((l) => l.language === form.language)?.locale;
});

const goBack = () => {
  window.history.back();
};

const toggleMenu = () => {
  shared.setSidebarOpen(!shared.hasOpenSidebar);
};

const languageOptions = computed(() => {
  return shared.languages.map((l) => l.language) as string[];
});
</script>
<style lang="postcss" scoped>
.nav-icon {
  @apply flex size-14 items-center justify-center rounded-full transition-all duration-75 hover:bg-gray-100;
}
.nav-link {
  @apply w-full rounded-full px-6 py-[18px] text-left text-sm font-semibold leading-5 hover:bg-gray-100;
}
.active {
  @apply bg-blue-50;
}
</style>
