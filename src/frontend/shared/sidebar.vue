<template>
  <aside
    :class="[
      'fixed inset-y-0 z-20 max-w-[320px] bg-white shadow-md transition-all duration-75',

      shared.hasOpenSidebar
        ? 'left-0 top-0 max-h-screen rounded-r-[20px]'
        : 'left-3 top-3 mx-auto max-h-min rounded-full',
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
          <Link :class="['nav-icon']" :href="`/${locale}/dashboard`">
            <Icon name="home" />
          </Link>
          <button class="nav-icon" @click="goBack">
            <Icon name="reply" />
          </button>
          <div v-if="isMultiLingual">
            <button
              v-if="shared.hasOpenSidebar"
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
              v-if="!shared.hasOpenSidebar"
              :current-locale="locale"
              :current-language="shared.language.language"
              :languages="shared.languages"
              :is-read-only="!shared.user.isManager"
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
            <Link
              v-for="(story, index) in shared.stories"
              :key="index"
              :class="[
                'nav-link',
                {
                  active: story.toLowerCase() === shared.currentStoryName?.toLowerCase(),
                },
              ]"
              :href="`/${locale}/story/${index + 1}`"
            >
              {{ story }}
            </Link>
            <Link
              :class="[
                'nav-link',
                {
                  active: $page?.url.includes(`/${locale}/page`),
                },
              ]"
              :href="`/${locale}/page`"
              >Pages</Link
            >
            <div v-if="isMultiLingual">
              <button
                v-if="locale === 'en'"
                class="nav-link opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Interface
              </button>
              <Link
                v-else
                :class="[
                  'nav-link flex items-center justify-between',
                  {
                    active: $page?.url.includes('ui'),
                  },
                ]"
                :href="`/${locale}/ui`"
                ><span>Interface</span>
                <span class="text-yellow-500">{{ shared.uiTodoCount }}</span>
              </Link>
            </div>
          </section>
          <div class="my-7 border-t border-gray-200"></div>
          <section class="grid grid-cols-1">
            <!-- <Link class="flex items-center nav-link gap-x-3" href="/profile">
              <Icon name="user" />
              <span>Profile</span>
            </Link> -->
            <Link
              v-if="isAdmin"
              :class="[
                'nav-link flex items-center gap-x-3',
                {
                  active: $page?.url === '/user',
                },
              ]"
              :href="`/${locale}/user`"
            >
              <Icon name="users" />
              <span>Users</span>
            </Link>
            <a
              v-if="shared.meta.helpUrl"
              class="nav-link flex items-center gap-x-3"
              :href="shared.meta.helpUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="help" />
              <span>Support</span>
            </a>
            <Link class="nav-link flex items-center gap-x-3" href="/logout">
              <Icon name="logout" />
              <span>Logout</span>
            </Link>
          </section>
        </div>
      </div>
      <div :class="[shared.hasOpenSidebar ? 'px-4 pb-4' : 'hidden']">
        <DropUp
          v-model="shared.language.language"
          :is-read-only="!shared.user.isManager"
          :options="languageOptions"
          @change="onLanguage"
        />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSharedStore } from '../store';
import { Link, router } from '@inertiajs/vue3';

import Icon from '../shared/icon.vue';
import LanguageSelector from './language-selector.vue';
import DropUp from './drop-up.vue';

const shared = useSharedStore();

const onLanguage = async (lang: string) => {
  const newLocale = shared.languages.find((l) => l.language === lang)?.locale;
  if (!newLocale) return;
  if (newLocale === shared.locale) return;

  const newPath = newPathFromLocale(newLocale);
  router.get(newPath);
};

const newPathFromLocale = (targetLocale: string) => {
  // const url = usePage().url;  not working
  const url = window.location.href;

  if (url.includes('/ui')) {
    return `/${targetLocale}/ui`;
  }

  if (url.includes('/page')) {
    return `/${targetLocale}/page`;
  }

  if (url.includes('/story/')) {
    const part = url.split('/story/')[1];
    const storyId = part.split('/')[0];
    return `/${targetLocale}/story/${storyId}`;
  }

  return `/${targetLocale}`;
};

const isMultiLingual = computed(() => shared.languages.length > 1);

const isAdmin = computed(() => shared.user.isAdmin);

const locale = computed(() => {
  return shared.locale ?? 'en';
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
  @apply flex size-14 items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:bg-gray-100;
}
.nav-link {
  @apply w-full rounded-full px-6 py-[18px] text-left text-sm font-semibold leading-5 transition-all duration-200 ease-in-out hover:bg-gray-100;
}
</style>
