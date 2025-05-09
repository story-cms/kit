<template>
  <td class="px-3 py-4">
    <div class="flex items-center">
      <div class="size-11 shrink-0">
        <div class="grid size-11 place-items-center rounded-full bg-red-300">
          <p class="font-extrabold uppercase text-white">
            {{ user.initials }}
          </p>
        </div>
      </div>
      <div class="ml-4">
        <div class="font-medium capitalize text-gray-900">{{ user.name }}</div>
        <div class="text-gray-500">{{ user.email }}</div>
      </div>
    </div>
  </td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
    <span class="rounded-full bg-gray-100 px-[10px] py-[2px] capitalize">
      {{ user.role }}</span
    >
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
      class="absolute -left-16 top-12 z-10 flex w-[164px] flex-col gap-2 rounded-lg border bg-white shadow-sm"
    >
      <button
        class="py-4 pl-6 text-left text-sm text-gray-500 hover:bg-gray-100"
        @click="(emit('update'), (showDropdown = false))"
      >
        Update User
      </button>
      <button
        v-if="user.id != shared.user.id"
        class="py-4 pl-6 text-left text-sm text-gray-500 hover:bg-gray-100"
        @click="(emit('remove'), (showDropdown = false))"
      >
        Remove User
      </button>
    </div>
  </td>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Icon from '../../shared/icon.vue';
import type { UserMeta } from '../../../types';
import { useSharedStore } from '../../store';

const shared = useSharedStore();

const showDropdown = ref(false);

const emit = defineEmits<{
  (e: 'update'): void;
  (e: 'remove'): void;
}>();

const props = defineProps<{
  user: UserMeta;
}>();

const language = computed(() => {
  if (props.user.language === '*') {
    return 'All';
  }

  return shared.languages.find((language) => language.locale === props.user.language)
    ?.language;
});
</script>
