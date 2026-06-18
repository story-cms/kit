<template>
  <aside
    :class="[
      'fixed inset-y-0 z-20 bg-white shadow-md transition-all duration-75',

      shared.hasOpenSidebar
        ? 'left-0 top-0 max-h-screen w-[320px] rounded-r-[20px]'
        : 'left-3 top-3 mx-auto max-h-min rounded-full',
    ]"
  >
    <nav :class="{ 'flex h-full flex-col': shared.hasOpenSidebar }">
      <div :class="['flex-1', shared.hasOpenSidebar ? 'overflow-y-auto' : '']">
        <div
          :class="[
            'flex',
            shared.hasOpenSidebar ? 'justify-between p-5' : 'flex-col gap-y-3 p-2',
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
              :languages="sidebarLanguages"
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
            <a
              v-if="subscribed('stream')"
              :class="classList('stream')"
              :href="`/${locale}/stream`"
              >Streams</a
            >

            <a
              v-if="subscribed('story')"
              :class="classList('story')"
              :href="`/${locale}/story`"
              >Stories</a
            >

            <a
              v-if="subscribed('page')"
              :class="classList('page')"
              :href="`/${locale}/page`"
              >Pages</a
            >

            <a
              v-if="subscribed('resource')"
              :class="classList('resource')"
              :href="`/${locale}/resource`"
              >Resources</a
            >

            <a
              v-if="subscribed('invitation')"
              :class="classList('invitation')"
              :href="`/${locale}/invitation`"
              >Invitations</a
            >

            <a
              v-if="subscribed('audience')"
              :class="classList('audience')"
              :href="`/${locale}/audience`"
              >Audience</a
            >

            <div v-if="subscribed('ui')">
              <button
                v-if="locale === 'en'"
                class="nav-link opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Interface
              </button>
              <a v-else :class="classList('ui', true)" :href="`/${locale}/ui`"
                ><span>Interface</span>
              </a>
            </div>
          </section>
          <div v-if="shared.bookmarks.length > 0">
            <div class="my-7 border-t border-gray-200"></div>
            <div class="flex flex-col">
              <a
                v-for="bookmark in shared.bookmarks"
                :key="bookmark.label"
                class="flex items-center justify-between gap-3 rounded-full px-6 py-[18px] text-left text-sm font-semibold leading-5 transition-all duration-200 ease-in-out hover:bg-gray-100"
                :href="bookmark.link"
              >
                <div class="flex items-center gap-3">
                  <Icon name="star" class="size-6" />
                  <span class="line-clamp-2">{{ bookmark.label }}</span>
                </div>
                <span class="uppercase">{{ extractLocaleFromLink(bookmark.link) }}</span>
              </a>
            </div>
          </div>
          <div class="my-7 border-t border-gray-200"></div>
          <section class="grid grid-cols-1">
            <a
              v-if="isAdmin"
              :class="classList('settings', true)"
              :href="`/${locale}/settings`"
            >
              <Icon name="settings" />
              <span>Settings</span>
            </a>

            <a v-if="isAdmin" :class="classList('user', true)" :href="`/${locale}/user`">
              <Icon name="users" />
              <span>Team</span>
            </a>
            <a
              v-if="shared.config.helpUrl"
              :class="classList('support', true)"
              :href="shared.config.helpUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="help" />
              <span>Support</span>
            </a>
            <a :class="classList('logout', true)" href="/logout">
              <Icon name="logout" />
              <span>Logout</span>
            </a>
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
import { router, usePage } from '@inertiajs/vue3';

import Icon from '../shared/icon.vue';
import LanguageSelector from './language-selector.vue';
import DropUp from './drop-up.vue';
import type { Subscription } from '../../types';
import { normalizePathForLanguageSwitch, replaceLocaleInPath } from './helpers';
import { languageDisplayName, type LanguageSortable } from './helpers';

function isEnglishLanguage(item: LanguageSortable): boolean {
  return (
    item.locale === 'en' ||
    languageDisplayName(item.language).localeCompare('English', undefined, {
      sensitivity: 'base',
    }) === 0
  );
}

/** English first, then remaining languages A–Z by display name. */
function compareLanguages(a: LanguageSortable, b: LanguageSortable): number {
  if (isEnglishLanguage(a) && !isEnglishLanguage(b)) return -1;
  if (!isEnglishLanguage(a) && isEnglishLanguage(b)) return 1;
  return languageDisplayName(a.language).localeCompare(languageDisplayName(b.language));
}

function sortLanguages<T extends LanguageSortable>(languages: T[]): T[] {
  return [...languages].sort(compareLanguages);
}

const shared = useSharedStore();
const page = usePage();

const sidebarLanguages = computed(() => sortLanguages(shared.languages));

const onLanguage = async (lang: string) => {
  const newLocale = sidebarLanguages.value.find((l) => l.language === lang)?.locale;
  if (!newLocale) return;
  if (newLocale === shared.locale) return;

  const newPath = newPathFromLocale(newLocale);
  router.get(newPath);
};

const newPathFromLocale = (targetLocale: string) => {
  const pageUrl = page.url || `${window.location.pathname}${window.location.search}`;
  const [pathname, search = ''] = pageUrl.split('?');
  const locales = shared.languages.map((l) => l.locale);
  const normalized = normalizePathForLanguageSwitch(pathname);
  const swapped =
    replaceLocaleInPath(normalized, targetLocale, locales) ??
    `/${targetLocale}/dashboard`;
  return search ? `${swapped}?${search}` : swapped;
};

const isAdmin = computed(() => shared.user.isAdmin);

const subscribed = (element: Subscription): boolean => {
  return shared.config.subscriptions.includes(element);
};

const locale = computed(() => {
  return shared.locale ?? 'en';
});

const goBack = () => {
  window.history.back();
};

const toggleMenu = () => {
  shared.setSidebarOpen(!shared.hasOpenSidebar);
};

const languageOptions = computed(() => sidebarLanguages.value.map((l) => l.language));

const classList = (path: string, withGap: boolean = false) => {
  const url = window.location.href?.replace('/drop', '/stream') || '';

  return {
    'nav-link': true,
    active: url.includes(`/${locale.value}/${path}`),
    'flex items-center gap-x-3': withGap,
  };
};

const extractLocaleFromLink = (link: string): string => {
  const match = link.match(/^\/([a-z]{2})\//);
  return match ? match[1] : '';
};
</script>

<style lang="postcss" scoped>
.nav-icon {
  @apply flex size-14 items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:bg-gray-100;
}
.nav-link {
  @apply w-full rounded-full px-6 py-[18px] text-left text-sm font-semibold leading-5 transition-all duration-200 ease-in-out hover:bg-gray-100;
}
</style>
