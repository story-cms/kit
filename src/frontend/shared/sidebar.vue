<template>
  <nav
    :class="[
      shared.openSidebar
        ? 'sticky left-0 top-0 h-screen overflow-y-auto rounded-r-[20px] border pb-[26px] pt-9'
        : 'fixed top-5 rounded-[20px] bg-white px-7 py-4 shadow-lg',
      shared.expandMenu ? 'h-[calc(100vh-40px)]' : '',
      'z-20 flex w-full max-w-96 flex-col',
    ]"
  >
    <div :class="[shared.openSidebar ? 'px-10' : 'px-0']">
      <div v-if="!shared.hasFeedback" class="flex justify-between">
        <Link href="/">
          <Icon name="home" />
        </Link>
        <button @click="goBack">
          <Icon name="reply" />
        </button>
        <Menu as="div" class="relative inline-block text-left">
          <div>
            <MenuButton class="relative">
              <Icon name="translate" />
              <span
                class="absolute -top-2 left-5 rounded-[7px] bg-[#EDE9FE] px-1 py-[2px] text-[8px] font-medium uppercase leading-[9.36px] text-[#5B21B6]"
                >{{ currentLocale }}</span
              >
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute left-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
              <div
                class="py-1"
                v-for="language in shared.languages"
                :key="language.language"
              >
                <MenuItem v-slot="{ active }">
                  <button
                    @click="onLanguage(language.language)"
                    :class="[
                      active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700',
                      'flex w-full items-center gap-x-2 px-4 py-2 text-left text-sm',
                    ]"
                  >
                    <span> {{ language.language }}</span>
                    <Icon name="check" v-if="language.language === form.language" />
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
        <button @click="toggleMenu">
          <Icon name="chevron-double-right" v-if="!shared.expandMenu" />
          <Icon name="chevron-double-left" v-else="shared.expandMenu" />
        </button>
      </div>
      <MessageCentre
        v-else
        :response="shared.messageCentre.response"
        :message="shared.messageCentre.message"
      />
    </div>
    <div v-if="shared.expandMenu" class="mt-14 grow">
      <div class="grid grid-cols-1 gap-4 pl-8">
        <Link
          class="px-3 py-2 text-lg font-semibold leading-6 text-black hover:gray-800"
          href="/"
        >
          Dashboard
        </Link>
        <div v-for="story in shared.stories" :key="story">
          <button
            class="block px-3 py-2 text-lg font-semibold leading-6 text-black hover:gray-800"
            @click="onStory(story)"
          >
            {{ story }}
          </button>
        </div>
        <Link
          v-if="isMultiLingualAdmin"
          class="px-2 py-3 text-sm text-gray-500 hover:text-gray-700"
          href="/page"
          >Pages</Link
        >
        <Link
          v-if="isMultiLingual"
          class="relative px-3 py-2 text-lg font-semibold leading-6 text-black hover:gray-800"
          :class="{ 'cursor-not-allowed': shared.language.locale === 'en' }"
          :disabled="shared.language.locale === 'en'"
          href="/ui"
          >Interface
          <!-- Todo: add remaining translation todos count to the badge -->
          <span
            class="absolute ml-2 rounded-full bg-red-100 px-1 py-[2px] text-xs font-medium leading-4 text-red-800"
            >5</span
          >
        </Link>
      </div>
      <div class="mx-5 my-4 border-t border-gray-400"></div>
      <div class="grid grid-cols-1 pl-8 gap-y-6">
        <Link
          v-if="shared.user.isAdmin"
          class="flex items-center px-3 py-2 text-lg font-semibold leading-6 text-black hover:gray-800 gap-x-2"
          href="/user"
        >
          <Icon name="users" />
          <span> Users </span>
        </Link>
        <Link
          v-if="shared.meta.helpUrl"
          class="flex items-center px-3 text-lg font-semibold leading-6 text-black p y-2 items- hover:gray-800 gap-x-2"
          :href="shared.meta.helpUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="question-mark" />
          <span> Help </span>
        </Link>
        <button
          @click="signOut()"
          class="flex items-center px-3 py-2 text-lg font-semibold leading-6 text-black hover:gray-800 gap-x-2"
        >
          <Icon name="logout" />
          <span> Log out </span>
        </button>
      </div>
    </div>
    <div v-if="shared.expandMenu" class="flex items-center justify-center">
      <LiftUp
        v-model="form.language as string"
        @change="onLanguage"
        :options="shared.languages.map((l) => l.language) as string[]"
        :is-read-only="!shared.user.isManager"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import LiftUp from './lift-up.vue';
import MessageCentre from './message-centre.vue';
import Icon from './icon.vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';

import { useSharedStore } from '../store';
const shared = useSharedStore();

const form = useForm({
  language: shared.language.language,
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
const isMultiStory = computed(() => shared.stories.length > 1);
// a computed prop that returns a bool if user is admin and multi lingual
const isMultiLingualAdmin = computed(
  () => shared.user.isAdmin && shared.user.language === '*',
);

const currentLocale = computed(() => {
  return shared.languages.find((l) => l.language === form.language)?.locale;
});

const goBack = () => {
  window.history.back();
};

const toggleMenu = () => {
  shared.expandMenu = !shared.expandMenu;
};

watch(
  () => shared.expandMenu,
  (newVal) => {
    if (newVal) {
      shared.openSidebar = true;
    } else {
      shared.openSidebar = false;
    }
  },
);
</script>
