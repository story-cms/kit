<template>
  <aside
    :class="[
      'max-w-[320px] bg-white shadow-md transition-all duration-75',
      shared.hasFloatingSidebar ? 'fixed inset-y-0 z-30' : 'sticky z-10',
      shared.hasOpenSidebar
        ? 'top-0 max-h-screen rounded-r-[20px]'
        : 'top-3 mx-auto max-h-min rounded-full',
    ]"
  >
    <nav :class="{ 'flex h-full flex-col justify-between': shared.hasOpenSidebar }">
      <div>
        <div
          :class="[
            'flex',
            shared.hasOpenSidebar ? 'justify-between p-5' : 'flex-col gap-y-3 p-2',
          ]"
        >
          <Link :class="['nav-icon', true ? 'active' : '']" href="/">
            <Icon name="home" />
          </Link>
          <button @click="goBack" class="nav-icon">
            <Icon name="reply" />
          </button>
          <div v-if="isMultiLingual">
            <button
              v-if="shared.hasOpenSidebar"
              class="relative flex size-14 items-center justify-center rounded-full transition-all duration-75 hover:bg-gray-100"
            >
              <span
                class="absolute right-2 top-4 rounded-[7px] bg-blue-100 px-1 py-[2px] text-[8px] font-medium uppercase leading-[9.36px] text-blue-800"
              >
                {{ currentLocale }}
              </span>
              <Icon name="translate" />
            </button>
            <LanguageSelector
              v-if="!shared.hasOpenSidebar"
              :current-locale="currentLocale"
              :current-language="form.language"
              :languages="shared.languages"
              @language-change="onLanguage"
            />
          </div>
          <button class="nav-icon" @click="toggleMenu">
            <Icon v-if="!shared.hasOpenSidebar" name="chevron-double-right" />
            <Icon v-else name="chevron-double-left" />
          </button>
        </div>
        <div :class="[shared.hasOpenSidebar ? 'mt-4 flex flex-col px-4' : 'hidden']">
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
                <span class="text-yellow-500">{{ shared.uiTodoCount }}</span>
              </Link>
            </div>
          </section>
          <div class="my-7 border-t border-gray-200"></div>
          <section class="grid grid-cols-1">
            <Link class="nav-link flex items-center gap-x-3" href="/profile">
              <Icon name="user" />
              <span>Profile</span>
            </Link>
            <Link v-if="isAdmin" class="nav-link flex items-center gap-x-3" href="/user">
              <Icon name="users" />
              <span>Users</span>
            </Link>
            <Link
              v-if="shared.meta.helpUrl"
              class="nav-link flex items-center gap-x-3"
              :href="shared.meta.helpUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="help" />
              <span>Help</span>
            </Link>
            <button class="nav-link flex items-center gap-x-3" @click="signOut">
              <Icon name="logout" />
              <span>Logout</span>
            </button>
          </section>
        </div>
      </div>
      <div :class="[shared.hasOpenSidebar ? 'px-4 pb-4' : 'hidden']">
        <DropUp
          v-model="form.language"
          :is-read-only="!shared.user.isManager"
          :options="languageOptions"
          @change="onLanguage"
        />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useSharedStore } from '../store';
import { Link, useForm } from '@inertiajs/vue3';

import Icon from '../shared/icon.vue';
import LanguageSelector from './language-selector.vue';
import DropUp from './drop-up.vue';

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
  // @ts-expect-error - Ignoring type mismatch for now
  form.story = story;
  // @ts-expect-error - Ignoring type mismatch for now
  form.language = null;
  form.post('/switch');
};

const signOut = () => {
  window.location.href = '/logout';
};

const isMultiLingual = computed(() => shared.languages.length > 1);

const isAdmin = computed(() => shared.user.isAdmin);

const currentLocale = computed(() => {
  return shared.languages.find((l) => l.language === form.language)?.locale ?? 'en';
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

watch(
  () => shared.hasOpenSidebar,
  (newVal) => {
    if (newVal && shared.isLargeScreen) {
      shared.setSidebarAsFloating(false);
    }
    if (newVal && !shared.isLargeScreen) {
      shared.setSidebarAsFloating(true);
    }
    if (!newVal) {
      shared.setSidebarAsFloating(false);
    }
  },
  { immediate: true },
);
</script>
<style lang="postcss" scoped>
.nav-icon {
  @apply flex size-14 items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:bg-gray-100;
}
.nav-link {
  @apply w-full rounded-full px-6 py-[18px] text-left text-sm font-semibold leading-5 transition-all duration-200 ease-in-out hover:bg-gray-100;
}
.active {
  @apply bg-blue-50 transition-all duration-200 ease-in-out;
}
</style>
