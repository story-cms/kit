<template>
  <td class="px-3 py-4">
    <div class="flex items-center">
      <div class="size-11 shrink-0">
        <div class="grid bg-red-300 rounded-full size-11 place-items-center">
          <p class="font-extrabold text-white uppercase">
            {{ user.initials }}
          </p>
        </div>
      </div>
      <div class="ml-4">
        <div class="font-medium text-gray-900 capitalize">{{ user.name }}</div>
        <div class="text-gray-500">{{ user.email }}</div>
      </div>
    </div>
  </td>
  <td class="px-3 py-4 text-sm text-gray-800 whitespace-nowrap">
    <span class="rounded-full bg-gray-100 px-[10px] py-[2px] capitalize">
      <span v-if="user.hasPendingInvite" class="normal-case">Invite pending</span>
      <span v-else>{{ user.role }}</span>
    </span>
  </td>
  <td class="px-3 py-4 text-sm text-blue-800 whitespace-nowrap">
    <span class="rounded-full bg-blue-100 px-[10px] py-[2px]"> {{ language }}</span>
  </td>
  <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
    {{ lastActivity }}
  </td>
  <td class="relative py-4 pl-3 pr-4 text-sm sm:pr-6">
    <button class="cursor-pointer" @click="showDropdown = !showDropdown">
      <Icon name="dots-horizontal" class="w-5 h-5" />
    </button>
    <div
      v-if="showDropdown"
      class="absolute -left-16 top-12 z-10 flex w-[164px] flex-col gap-2 rounded-lg border bg-white shadow-sm"
    >
      <button
        class="py-4 pl-6 text-sm text-left text-gray-500 hover:bg-gray-100"
        @click="(emit('update'), (showDropdown = false))"
      >
        Update User
      </button>
      <button
        v-if="user.id != shared.user.id"
        class="py-4 pl-6 text-sm text-left text-gray-500 hover:bg-gray-100"
        @click="(emit('remove'), (showDropdown = false))"
      >
        Remove User
      </button>
    </div>
  </td>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { DateTime } from 'luxon';
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

const lastActivity = computed(() => {
  if (props.user.lastActivity === null) {
    return 'No activity';
  }

  const date = DateTime.fromISO(props.user.lastActivity);
  const now = DateTime.now();

  const diff = now.diff(date, 'days').days;

  if (diff < 1) {
    return 'Today';
  } else if (diff < 2) {
    return 'Yesterday';
  } else if (diff < 7) {
    return date.toFormat('cccc');
  } else if (date.year === now.year) {
    const day = date.day;
    const ordinal =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
          ? 'nd'
          : day === 3 || day === 23
            ? 'rd'
            : 'th';
    return `${day}${ordinal} ${date.toFormat('MMMM')}`;
  } else {
    return date.toFormat('dd/MM/yy');
  }
});

const language = computed(() => {
  if (props.user.language === '*') {
    return 'All';
  }

  return shared.languages.find((language) => language.locale === props.user.language)
    ?.language;
});
</script>
