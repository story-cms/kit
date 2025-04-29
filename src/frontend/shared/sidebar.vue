<template>
  <nav
    :class="[
      shared.hasNonFloatingSidebar
        ? 'sticky left-0 top-0 h-screen overflow-y-auto rounded-r-[20px] border pb-[26px] pt-9'
        : 'fixed top-5 rounded-[20px] bg-white px-7 py-4 shadow-lg',
      shared.hasOpenSidebar ? 'h-[calc(100vh-40px)]' : '',
      'z-20 flex w-full max-w-96 flex-col',
    ]"
  >
    <div :class="[shared.hasNonFloatingSidebar ? 'px-10' : 'px-0']">
      <div v-if="!shared.hasFeedback" class="flex justify-between">
        <Link href="/">
          <Icon name="home" />
        </Link>
        <button @click="goBack">
          <Icon name="reply" />
        </button>
        <LanguageSelector
          :is-expanded="shared.hasOpenSidebar"
          :current-locale="currentLocale"
          :current-language="form.language"
          :languages="shared.languages"
          @language-change="onLanguage"
        />
        <button @click="toggleMenu">
          <Icon v-if="!shared.hasOpenSidebar" name="chevron-double-right" />
          <Icon v-else name="chevron-double-left" />
        </button>
      </div>
      <MessageCentre
        v-else
        :response="shared.messageCentre.response"
        :message="shared.messageCentre.message"
      />
    </div>
    <div v-if="shared.hasOpenSidebar" class="mt-14 grow">
      <div class="grid grid-cols-1 gap-4 pl-8">
        <Link
          class="hover:gray-800 px-3 py-2 text-lg font-semibold leading-6 text-black"
          href="/"
        >
          Dashboard
        </Link>
        <div v-for="story in shared.stories" :key="story">
          <button
            class="hover:gray-800 block px-3 py-2 text-lg font-semibold leading-6 text-black"
            @click="onStory(story)"
          >
            {{ story }}
          </button>
        </div>
        <Link
          class="hover:gray-800 px-3 py-2 text-lg font-semibold leading-6 text-black"
          href="/page"
          >Pages</Link
        >
        <div v-if="isMultiLingual">
          <span
            v-if="currentLocale === 'en'"
            class="hover:gray-800 cursor-not-allowed px-3 py-2 text-lg font-semibold leading-6 text-black opacity-50"
            >Interface</span
          >
          <Link
            v-else
            class="hover:gray-800 px-3 py-2 text-lg font-semibold leading-6 text-black"
            href="/ui"
            >Interface
            <span
              class="absolute ml-2 rounded-full bg-red-100 px-1 py-[2px] text-xs font-medium leading-4 text-red-800"
              >{{ shared.uiTodoCount }}</span
            >
          </Link>
        </div>
      </div>
      <div class="mx-5 my-4 border-t border-gray-400"></div>
      <div class="grid grid-cols-1 gap-y-6 pl-8">
        <Link
          v-if="isAdmin"
          class="hover:gray-800 flex items-center gap-x-2 px-3 py-2 text-lg font-semibold leading-6 text-black"
          href="/user"
        >
          <Icon name="users" />
          <span> Users </span>
        </Link>
        <Link
          v-if="shared.meta.helpUrl"
          class="p y-2 items- hover:gray-800 flex items-center gap-x-2 px-3 text-lg font-semibold leading-6 text-black"
          :href="shared.meta.helpUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="question-mark" />
          <span> Help </span>
        </Link>
        <button
          class="hover:gray-800 flex items-center gap-x-2 px-3 py-2 text-lg font-semibold leading-6 text-black"
          @click="signOut()"
        >
          <Icon name="logout" />
          <span> Log out </span>
        </button>
      </div>
    </div>
    <div v-if="shared.hasOpenSidebar" class="flex items-center justify-center">
      <DropUp
        v-model="form.language"
        :is-read-only="!shared.user.isManager"
        :options="languageOptions"
        @change="onLanguage"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3';
import { computed, watch } from 'vue';
import DropUp from './drop-up.vue';
import MessageCentre from './message-centre.vue';
import Icon from './icon.vue';
import LanguageSelector from './language-selector.vue';
import { useSharedStore } from '../store';

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
    if (!newVal && shared.isLargeScreen) {
      shared.setSidebarAsFloating(true);
    }
  },
);
</script>
