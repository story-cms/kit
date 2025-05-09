<template>
  <td class="px-3 py-4">
    <div class="flex items-center">
      <div class="size-11 shrink-0">
        <div class="grid size-11 place-items-center rounded-full bg-red-300">
          <p class="font-extrabold text-white">
            {{ user.initials }}
          </p>
        </div>
      </div>
      <div class="ml-4">
        <div class="font-medium text-gray-900">{{ user.name }}</div>
        <div class="text-gray-500">{{ user.email }}</div>
      </div>
    </div>
  </td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
    <span class="rounded-full bg-gray-100 px-[10px] py-[2px]"> {{ user.role }}</span>
  </td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-blue-800">
    <span class="rounded-full bg-blue-100 px-[10px] py-[2px]"> {{ language }}</span>
  </td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
    {{ user.lastActivity }}
  </td>
  <td class="relative py-4 pl-3 pr-4 text-sm sm:pr-6">
    <button class="cursor-pointer" @click="showDropdown = !showDropdown">
      <Icon name="dots-horizontal" class="h-5 w-5" />
    </button>
    <div
      v-if="showDropdown"
      class="z absolute -left-16 top-12 z-10 flex flex-col gap-2 rounded-lg border bg-white p-2 shadow-sm"
    >
      <button class="px-4 py-2 text-sm text-gray-500">Update User</button>
      <button class="px-4 py-2 text-sm text-gray-500">Remove User</button>
    </div>
  </td>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Icon from '../../shared/icon.vue';
import type { User } from '../../../types';
import { useSharedStore } from '../../store';

const sharedStore = useSharedStore();

const showDropdown = ref(false);

const props = defineProps<{
  user: User;
}>();

const language = computed(() => {
  if (props.user.language === '*') {
    return 'All';
  }

  return sharedStore.languages.find((language) => language.locale === props.user.language)
    ?.language;
});
</script>
