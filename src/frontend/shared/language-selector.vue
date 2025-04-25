<template>
  <div v-if="isExpanded" class="relative inline-block text-left">
    <div class="relative">
      <Icon name="translate" />
      <span
        class="absolute -top-2 left-5 rounded-[7px] bg-[#EDE9FE] px-1 py-[2px] text-[8px] font-medium uppercase leading-[9.36px] text-[#5B21B6]"
        >{{ currentLocale }}</span
      >
    </div>
  </div>
  <Menu v-else as="div" class="relative inline-block text-left">
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
        class="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
      >
        <div v-for="language in languages" :key="language.language" class="py-1">
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700',
                'flex w-full items-center gap-x-2 px-4 py-2 text-left text-sm',
              ]"
              @click="onLanguage(language.language)"
            >
              <span> {{ language.language }}</span>
              <Icon v-if="language.language === currentLanguage" name="check" />
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import Icon from './icon.vue';

defineProps<{
  isExpanded: boolean;
  currentLocale: string;
  currentLanguage: string;
  languages: Array<{ language: string }>;
}>();

const emit = defineEmits<{
  (e: 'languageChange', language: string): void;
}>();

const onLanguage = (language: string) => {
  emit('languageChange', language);
};
</script>
