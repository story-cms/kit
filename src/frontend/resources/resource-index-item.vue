<template>
  <div
    v-if="viewMode === 'grid'"
    class="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
  >
    <button
      type="button"
      class="group/edit flex min-h-0 flex-1 flex-col text-left"
      @click="emit('edit', resource.id)"
    >
      <div v-if="resource.imageUrl" class="h-48 overflow-hidden bg-gray-100">
        <img
          :src="resource.imageUrl"
          :alt="resource.title"
          class="size-full object-cover transition duration-300 group-hover/edit:scale-105 group-hover/edit:opacity-90"
        />
      </div>
      <div
        v-else
        class="flex h-48 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
      >
        <component
          :is="iconFor(resource.type)"
          class="size-8 text-gray-400 transition-opacity group-hover/edit:opacity-70"
          aria-hidden="true"
        />
      </div>

      <div class="min-h-0 flex-1 px-5 pt-5">
        <h3
          class="mb-2 line-clamp-2 text-base font-semibold text-gray-900 transition-opacity group-hover/edit:opacity-70"
        >
          {{ resource.title }}
        </h3>

        <p
          v-if="resource.description"
          class="line-clamp-2 min-h-10 text-sm leading-5 text-gray-500 transition-opacity group-hover/edit:opacity-70"
        >
          {{ resource.description }}
        </p>
        <div v-else class="min-h-10" aria-hidden="true" />
      </div>
    </button>

    <div class="mt-2 px-5 pb-5">
      <div
        class="flex min-w-0 items-center justify-between gap-3 border-t border-gray-100 pt-3"
      >
        <div
          v-if="resource.label"
          class="flex min-w-0 flex-1 items-center gap-2 overflow-hidden"
        >
          <Tag class="size-3 shrink-0 text-gray-400" aria-hidden="true" />
          <span class="truncate text-xs text-gray-500">{{ resource.label }}</span>
        </div>

        <div
          class="flex shrink-0 items-center gap-2"
          :class="{ 'ml-auto': !resource.label }"
        >
          <ResourceTypeBadge :type="resource.type" />
          <span
            class="rounded px-2 py-0.5 text-xs font-medium capitalize"
            :class="visibilityBadgeClasses(resource.visibility)"
          >
            {{ resource.visibility }}
          </span>
          <Menu as="div" class="relative">
            <MenuButton
              class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <MoreVertical class="size-4" aria-hidden="true" />
            </MenuButton>
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="scale-95 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-95 opacity-0"
            >
              <MenuItems
                class="absolute bottom-full right-0 z-10 mb-2 w-48 origin-bottom-right rounded-lg border border-gray-200 bg-white py-1 shadow-lg focus:outline-none"
              >
                <MenuItem v-slot="{ active }">
                  <button
                    type="button"
                    :class="[
                      active ? 'bg-gray-50' : '',
                      'flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700',
                    ]"
                    @click="emit('edit', resource.id)"
                  >
                    <SquarePen class="size-4" aria-hidden="true" />
                    Edit
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    type="button"
                    :class="[
                      active ? 'bg-red-50' : '',
                      'flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600',
                    ]"
                    @click="emit('delete', resource.id)"
                  >
                    <Trash2 class="size-4" aria-hidden="true" />
                    Delete
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </div>

  <tr v-else class="transition-colors hover:bg-gray-50">
    <td class="max-w-[400px] px-6 py-4">
      <div class="group/edit flex min-w-0 items-center gap-3">
        <button
          type="button"
          class="shrink-0 rounded transition-opacity group-hover/edit:opacity-70"
          @click="emit('edit', resource.id)"
        >
          <ResourceThumbnail :item="resource" />
        </button>
        <div class="min-w-0 flex-1">
          <button
            type="button"
            class="block w-full truncate text-left text-sm font-medium text-gray-900 transition-opacity group-hover/edit:opacity-70"
            @click="emit('edit', resource.id)"
          >
            {{ resource.title }}
          </button>
          <button
            v-if="resource.description"
            type="button"
            class="block w-full truncate text-left text-xs text-gray-500 transition-opacity group-hover/edit:opacity-70"
            @click="emit('edit', resource.id)"
          >
            {{ resource.description }}
          </button>
        </div>
      </div>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
      {{ resource.label || '—' }}
    </td>
    <td class="whitespace-nowrap px-6 py-4">
      <ResourceTypeBadge :type="resource.type" />
    </td>
    <td class="whitespace-nowrap px-6 py-4">
      <span
        class="rounded px-2 py-1 text-xs font-medium capitalize"
        :class="visibilityBadgeClasses(resource.visibility)"
      >
        {{ resource.visibility }}
      </span>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
      {{ formatListDate(resource.updatedAt) }}
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-right">
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          class="rounded p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          @click="emit('edit', resource.id)"
        >
          <SquarePen class="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          @click="emit('delete', resource.id)"
        >
          <Trash2 class="size-4" aria-hidden="true" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import {
  ExternalLink,
  FileText,
  MoreVertical,
  SquarePen,
  Tag,
  Trash2,
  Video,
} from '@lucide/vue';
import { DateTime } from 'luxon';
import type { Component } from 'vue';
import type { ResourceIndexItem, ResourceType, VisibilityType } from '../../types';
import ResourceThumbnail from '../stories/components/resource-thumbnail.vue';
import ResourceTypeBadge from '../stories/components/resource-type-badge.vue';

defineProps<{
  resource: ResourceIndexItem;
  viewMode: 'grid' | 'list';
}>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

const formatListDate = (value: string): string => {
  const parsed = DateTime.fromISO(value);
  return parsed.isValid ? parsed.toFormat('dd-MM-yyyy') : value;
};

const visibilityBadgeClasses = (visibility: VisibilityType): string =>
  visibility === 'public'
    ? 'bg-green-100 text-green-700'
    : 'bg-gray-100 text-gray-700';

const iconFor = (type: ResourceType): Component => {
  switch (type) {
    case 'video':
      return Video;
    case 'url':
      return ExternalLink;
    case 'text':
    default:
      return FileText;
  }
};
</script>
