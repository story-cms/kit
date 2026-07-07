<template>
  <div
    v-if="viewMode === 'grid'"
    class="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
  >
    <button
      type="button"
      class="group/edit flex min-h-0 flex-1 flex-col text-left"
      @click="emit('edit', invitation.id)"
    >
      <div class="min-h-0 flex-1 px-5 pt-5">
        <div class="mb-2 flex flex-wrap items-center gap-2">
          <span
            class="rounded-xl px-2 py-0.5 text-xs font-medium"
            :class="statusBadgeClasses(status)"
          >
            {{ status }}
          </span>
        </div>

        <h3
          class="mb-3 line-clamp-2 text-base font-semibold text-gray-900 transition-opacity group-hover/edit:opacity-70"
        >
          {{ invitationName }}
        </h3>

        <div class="space-y-1 text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <span class="text-gray-400">Start:</span>
            <span>{{ startDate }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-400">End:</span>
            <span>{{ endDate }}</span>
          </div>
        </div>
      </div>

      <div class="mt-2 px-5 pb-5">
        <div class="border-t border-gray-100 pt-3">
          <div class="flex min-w-0 flex-wrap items-center gap-1.5 overflow-hidden">
            <span
              v-if="isForAllRegions"
              class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
            >
              All Regions
            </span>
            <template v-else>
              <span
                v-for="region in parsedRegions?.slice(0, 3)"
                :key="region"
                class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
              >
                {{ region }}
              </span>
              <span
                v-if="parsedRegions && parsedRegions.length > 3"
                class="text-xs text-gray-500"
              >
                +{{ parsedRegions.length - 3 }} more
              </span>
            </template>
          </div>
        </div>
      </div>
    </button>
  </div>

  <tr v-else class="transition-colors hover:bg-gray-50">
    <td class="max-w-[400px] px-6 py-4">
      <button
        type="button"
        class="group/edit text-left"
        @click="emit('edit', invitation.id)"
      >
        <span class="text-sm font-medium text-gray-900 transition-opacity group-hover/edit:opacity-70">
          {{ invitationName }}
        </span>
      </button>
    </td>
    <td class="max-w-[200px] px-6 py-4 text-sm text-gray-600">
      <span class="line-clamp-2">{{ regionsSummary }}</span>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
      {{ startDate }}
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
      {{ endDate }}
    </td>
    <td class="whitespace-nowrap px-6 py-4">
      <span
        class="rounded-xl px-2 py-1 text-xs font-medium"
        :class="statusBadgeClasses(status)"
      >
        {{ status }}
      </span>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-right">
      <button
        type="button"
        class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
        @click="emit('edit', invitation.id)"
      >
        <SquarePen class="size-4" aria-hidden="true" />
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { SquarePen } from '@lucide/vue';
import { computed } from 'vue';
import { formatDate, getInvitationStatus, padZero } from '../shared/helpers';
import type { InvitationItem } from '../../types';

const props = defineProps<{
  invitation: InvitationItem;
  viewMode: 'grid' | 'list';
}>();

const emit = defineEmits<{
  edit: [id: number];
}>();

const isForAllRegions = computed(() => props.invitation.regions?.length === 0);

const parsedRegions = computed(() =>
  props.invitation.regions?.split(',').map((region) => region.trim()),
);

const startDate = computed(() => {
  if (!props.invitation.window) return '—';
  return formatDate(props.invitation.window.split('|')[0])
    .split(' ')[0]
    .replace('-', '/')
    .replace(',', '');
});

const endDate = computed(() => {
  if (!props.invitation.window) return '—';
  return formatDate(props.invitation.window.split('|')[1])
    .split(' ')[0]
    .replace('-', '/')
    .replace(',', '');
});

const status = computed(() =>
  getInvitationStatus(props.invitation.isPublished, props.invitation.window ?? ''),
);

const invitationName = computed(() =>
  props.invitation.name === null ||
  props.invitation.name === undefined ||
  props.invitation.name === ''
    ? `Invitation ${padZero(props.invitation.id)}`
    : props.invitation.name,
);

const regionsSummary = computed(() => {
  if (isForAllRegions.value) return 'All Regions';
  if (!parsedRegions.value?.length) return '—';
  if (parsedRegions.value.length <= 3) return parsedRegions.value.join(', ');
  return `${parsedRegions.value.slice(0, 3).join(', ')} +${parsedRegions.value.length - 3} more`;
});

const statusBadgeClasses = (
  value: 'Draft' | 'Scheduled' | 'Completed' | 'Live',
): string => {
  switch (value) {
    case 'Live':
      return 'bg-green-100 text-green-700';
    case 'Scheduled':
      return 'bg-blue-100 text-blue-700';
    case 'Completed':
      return 'bg-gray-100 text-gray-700';
    case 'Draft':
    default:
      return 'bg-amber-100 text-amber-700';
  }
};
</script>
