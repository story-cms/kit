<template>
  <td class="px-3 py-4">
    <div class="flex items-center">
      <div class="size-11 shrink-0">
        <div class="grid size-11 place-items-center rounded-full bg-red-300">
          <p class="font-extrabold uppercase text-white">
            {{ audience.initials }}
          </p>
        </div>
      </div>
      <div class="ml-4">
        <div class="font-medium capitalize text-gray-900">{{ audience.name }}</div>
        <div class="text-gray-500">{{ audience.email }}</div>
      </div>
    </div>
  </td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
    {{ formatDate(audience.lastLogin) }}
  </td>

  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
    {{ formatDate(audience.createdAt) }}
  </td>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import type { Audience } from '../../../types';

defineProps<{
  audience: Audience;
}>();

const formatDate = (dateString: string) => {
  if (dateString === null) {
    return 'No activity';
  }

  const date = DateTime.fromISO(dateString);
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
};
</script>
