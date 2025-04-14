<template>
  <nav
    :class="[
      shared.openSidebar
        ? 'sticky left-0 top-0 h-screen overflow-y-auto rounded-r-[20px] border pb-[26px] pt-9'
        : 'fixed top-5 h-[calc(100vh-40px)] rounded-[20px] bg-white px-7 py-4 shadow-lg',
      'z-20 flex w-full max-w-96 flex-col transition-all duration-300 ease-in-out',
    ]"
  >
    <div
      :class="[
        shared.openSidebar ? 'px-10' : 'px-0',
        'transition-all duration-300 ease-in-out',
      ]"
    >
      <div v-if="!shared.hasFeedback" class="flex justify-between">
        <Link href="/">
          <Icon name="home" />
        </Link>
        <button @click="goBack">
          <Icon name="reply" />
        </button>
        <div class="relative">
          <Icon name="translate" />
          <span
            class="bg-purple_light text-purple_dark absolute -top-2 left-5 rounded-[7px] px-1 py-[2px] text-[8px] font-medium uppercase leading-[9.36px]"
            >{{ currentLocale }}</span
          >
        </div>
        <button @click="toggleSidebar">
          <Icon name="chevron-double-right" v-if="!shared.openSidebar" />
          <Icon name="chevron-double-left" v-else="shared.openSidebar" />
        </button>
      </div>
      <MessageCentre
        v-else
        :response="shared.messageCentre.response"
        :message="shared.messageCentre.message"
      />
    </div>
    <div v-if="expandMenu" class="mt-14 grow">
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
    <div class="flex items-center justify-center">
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
import { computed, ref } from 'vue';
import LiftUp from './lift-up.vue';
import MessageCentre from './message-centre.vue';
import Icon from './icon.vue';
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

const toggleSidebar = () => {
  shared.toggleSidebar();
};

const currentLocale = computed(() => {
  return shared.languages.find((l) => l.language === form.language)?.locale;
});

const goBack = () => {
  window.history.back();
};

const expandMenu = ref(true);
</script>
