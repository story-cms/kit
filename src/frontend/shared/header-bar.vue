<template>
  <nav id="navbar" class="flex items-center justify-between px-6 py-3 bg-white">
    <div class="flex">
      <div class="flex items-center space-x-6">
        <Link href="/">
          <img :src="shared.meta.logo" alt="Logo" class="w-auto h-12" />
        </Link>
        <!-- eslint-disable vue/valid-v-model -->
        <DropDown
          v-if="isMultiLingual"
          v-model="(form.language as string)"
          :options="(shared.languages.map((l) => l.language) as string[])"
          :is-read-only="!shared.user.isManager"
          @change="onLanguage"
        ></DropDown>
        <ContextMenu
          v-if="isMultiStory"
          :options="(shared.stories as string[])"
          :anchor="shared.meta.storyType"
          @select="onStory"
        ></ContextMenu>

        <Link
          v-if="!isMultiStory"
          class="px-2 py-3 text-sm text-gray-500 hover:text-gray-700"
          href="/"
          >{{ shared.meta.storyType }}s</Link
        >
        <Link
          v-if="isMultiLingualAdmin"
          class="px-2 py-3 text-sm text-gray-500 hover:text-gray-700"
          href="/page"
          >Pages</Link
        >
        <Link class="px-2 py-3 text-sm text-gray-500 hover:text-gray-700" href="/ui"
          >Interface</Link
        >
        <Link
          v-if="shared.user.isAdmin"
          class="px-2 py-3 text-sm text-gray-500 hover:text-gray-700"
          href="/user"
          >Users</Link
        >
        <a
          v-if="shared.meta.helpUrl"
          class="inline-block px-2 py-3 text-sm text-gray-500 hover:text-gray-700"
          :href="shared.meta.helpUrl"
          target="_blank"
          rel="noopener noreferrer"
          >Help
        </a>
      </div>
    </div>
    <div class="flex items-center">
      <div class="ml-6 text-lg font-extrabold">{{ shared.user.name }}</div>
      <Menu as="div" class="relative ml-3">
        <div>
          <MenuButton
            class="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span class="sr-only">Open user menu</span>
            <div
              class="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-accent-pink p-2.5 text-2xl font-extrabold leading-8 text-white"
            >
              {{ shared.user.initials }}
            </div>
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
            class="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <MenuItem v-slot="{ active }">
              <button
                type="button"
                :class="[
                  active ? 'bg-gray-100' : '',
                  'block w-full px-4 py-2 text-sm text-gray-700',
                ]"
                @click="signOut()"
              >
                Sign out
              </button>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import DropDown from './drop-down.vue';
import ContextMenu from './context-menu.vue';
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
</script>
