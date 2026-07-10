<template>
  <aside
    class="glass-surface fixed inset-y-0 z-20 left-0 top-0 max-h-screen w-[320px] rounded-r-[20px] transition-all duration-75"
  >
    <nav class="flex h-full flex-col">
      <div class="flex-1 overflow-y-auto">
        <NavRailToolbar variant="panel" />

        <div class="mt-4 flex flex-col px-4">
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
              v-if="isAdmin && subscribed('invitation')"
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
                  <Star class="size-6 shrink-0" aria-hidden="true" />
                  <span class="line-clamp-2">{{ bookmark.label }}</span>
                </div>
                <span class="uppercase">{{ extractLocaleFromLink(bookmark.link) }}</span>
              </a>
            </div>
          </div>
          <div class="my-7 border-t border-gray-200"></div>
          <section class="grid grid-cols-1">
            <a
              v-if="isAdmin && subscribed('settings')"
              :class="classList('settings', true)"
              :href="`/${locale}/settings`"
            >
              <Settings class="size-6 shrink-0" aria-hidden="true" />
              <span>Settings</span>
            </a>

            <a v-if="isAdmin" :class="classList('user', true)" :href="`/${locale}/user`">
              <Users class="size-6 shrink-0" aria-hidden="true" />
              <span>Team</span>
            </a>
            <a
              v-if="shared.config.helpUrl"
              :class="classList('support', true)"
              :href="shared.config.helpUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CircleHelp class="size-6 shrink-0" aria-hidden="true" />
              <span>Support</span>
            </a>
            <a :class="classList('logout', true)" href="/logout">
              <LogOut class="size-6 shrink-0" aria-hidden="true" />
              <span>Logout</span>
            </a>
          </section>
        </div>
      </div>
      <div class="px-4 pb-4">
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
import { CircleHelp, LogOut, Settings, Star, Users } from '@lucide/vue';
import DropUp from './drop-up.vue';
import NavRailToolbar from './nav-rail-toolbar.vue';
import { useSidebarNav } from './use-sidebar-nav';

const {
  shared,
  locale,
  isAdmin,
  languageOptions,
  subscribed,
  classList,
  extractLocaleFromLink,
  onLanguage,
} = useSidebarNav();
</script>

<style lang="postcss" scoped>
.nav-link {
  @apply w-full rounded-full px-6 py-[18px] text-left text-sm font-semibold leading-5 transition-all duration-200 ease-in-out hover:bg-gray-100;
}
</style>
