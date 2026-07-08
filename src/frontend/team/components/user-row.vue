<template>
  <tr class="transition-colors hover:bg-gray-50">
    <td class="max-w-[400px] px-6 py-4">
      <div class="group/edit flex min-w-0 items-center gap-3">
        <div class="size-11 shrink-0">
          <div class="grid size-11 place-items-center rounded-full bg-red-300">
            <p class="font-extrabold uppercase text-white">
              {{ user.initials }}
            </p>
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <button
            type="button"
            class="block w-full truncate text-left text-sm font-medium capitalize text-gray-900 transition-opacity group-hover/edit:opacity-70"
            @click="emit('update')"
          >
            {{ user.name }}
          </button>
          <button
            type="button"
            class="block w-full truncate text-left text-xs text-gray-500 transition-opacity group-hover/edit:opacity-70"
            @click="emit('update')"
          >
            {{ user.email }}
          </button>
        </div>
      </div>
    </td>
    <td class="whitespace-nowrap px-6 py-4">
      <span
        class="rounded-xl bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700"
      >
        <span v-if="user.hasPendingInvite" class="normal-case">Invite pending</span>
        <span v-else>{{ user.role }}</span>
      </span>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
      <span class="rounded-xl bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
        {{ language }}
      </span>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
      {{ lastActivity }}
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-right">
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          @click="emit('update')"
        >
          <SquarePen class="size-4" aria-hidden="true" />
        </button>
        <button
          v-if="user.id != shared.user.id"
          type="button"
          class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          @click="emit('remove')"
        >
          <Trash2 class="size-4" aria-hidden="true" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DateTime } from 'luxon';
import { SquarePen, Trash2 } from '@lucide/vue';
import type { UserMeta } from '../../../types';
import { useSharedStore } from '../../store';

const shared = useSharedStore();

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
