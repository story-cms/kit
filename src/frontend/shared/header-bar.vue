<template>
  <nav
    id="navbar"
    :class="[
      isSidebarOpen
        ? 'rounded-r-[20px] flex flex-col min-h-screen pb-[26px]'
        : 'rounded-[20px] ',
      'py-4  mb-6 bg-white shadow-lg  max-w-96 z-50 mt-5',
    ]"
  >
    <div :class="[isSidebarOpen ? 'px-[43px]' : 'px-7', 'flex justify-between']">
      <button>
        <Icon name="home" />
      </button>
      <button @click="goBack">
        <Icon name="reply" />
      </button>
      <div class="relative">
        <Icon name="translate" />
        <span
          class="absolute -top-2 left-5 rounded-[7px] bg-purple_light px-1 py-[2px] text-[8px] font-medium uppercase leading-[9.36px] text-purple_dark"
          >{{ currentLocale }}</span
        >
      </div>
      <button @click="toggleSidebar">
        <Icon name="chevron-double-right" v-if="!isSidebarOpen" />
        <Icon name="chevron-double-left" v-else="isSidebarOpen" />
      </button>
    </div>
    <div v-if="isSidebarOpen" class="mt-14 grow">
      <div class="grid grid-cols-1 gap-4 pl-8">
        <Link
          class="px-3 py-2 text-lg font-semibold leading-6 text-black hover:gray-800"
          href="/"
        >
          Dashboard
        </Link>
        <ul v-for="story in shared.stories" :key="story">
          <li class="grid grid-cols-1 gap-4">
            <Link
              class="px-3 py-2 text-lg font-semibold leading-6 text-black hover:gray-800"
              href="/"
            >
              {{ story }}
            </Link>
          </li>
        </ul>
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
            class="absolute px-1 ml-2 text-xs font-medium leading-4 text-red-800 bg-red-100 py-[2px] rounded-full"
            >5</span
          >
        </Link>
      </div>
      <div class="mx-5 my-4 border-t border-gray-400"></div>
      <div class="grid grid-cols-1 pl-8 gap-y-6">
        <Link
          v-if="shared.user.isAdmin"
          class="flex items-center px-3 py-2 text-lg font-semibold leading-6 text-black gap-x-2 hover:gray-800"
          href="/user"
        >
          <Icon name="users" />
          <span> Users </span>
        </Link>
        <Link
          v-if="shared.meta.helpUrl"
          class="flex items-center px-3 text-lg font-semibold leading-6 text-black p y-2 items- gap-x-2 hover:gray-800"
          :href="shared.meta.helpUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="question-mark" />
          <span> Help </span>
        </Link>
        <button
          @click="signOut()"
          class="flex items-center px-3 py-2 text-lg font-semibold leading-6 text-black gap-x-2 hover:gray-800"
        >
          <Icon name="logout" />
          <span> Log out </span>
        </button>
      </div>
    </div>
    <div v-if="isSidebarOpen" class="flex items-center justify-center">
      <LiftUp
        v-if="isMultiLingual"
        v-model="(form.language as string)"
        :options="(shared.languages.map((l) => l.language) as string[])"
        :is-read-only="!shared.user.isManager"
        @change="onLanguage"
      ></LiftUp>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import DropDown from './drop-down.vue';
import LiftUp from './lift-up.vue';
import ContextMenu from './context-menu.vue';
import Icon from './icon.vue';
import { useSharedStore } from '../store';
const shared = useSharedStore();

const navbar = ref<HTMLElement | null>(null);
defineExpose({ navbar });

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

const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const currentLocale = computed(() => {
  return shared.languages.find((l) => l.language === form.language)?.locale;
});

const goBack = () => {
  window.history.back();
};
</script>
