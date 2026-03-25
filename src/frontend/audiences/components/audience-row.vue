<template>
  <td class="px-3 py-4">
    <div class="flex items-center">
      <div class="size-11 shrink-0">
        <div class="grid size-11 place-items-center">
          <img
            :src="audience.photoURL"
            :alt="audience.name"
            class="size-full rounded-full object-cover"
          />
        </div>
      </div>
      <div class="ml-4">
        <div class="font-medium capitalize text-gray-900">{{ audience.name }}</div>
        <div class="text-gray-500">{{ audience.email }}</div>
      </div>
    </div>
  </td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
    {{ formatAudienceDate(audience.lastSignInTime, 'No activity') }}
  </td>

  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
    {{ formatAudienceDate(audience.signUpDate, '—') }}
  </td>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import type { AudienceMeta } from '../../../types';

defineProps<{
  audience: AudienceMeta;
}>();

const formatAudienceDate = (dateString: string, emptyLabel: string) => {
  if (dateString == null || String(dateString).trim() === '') {
    return emptyLabel;
  }

  const date = DateTime.fromISO(dateString);
  if (!date.isValid) {
    return emptyLabel;
  }

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
