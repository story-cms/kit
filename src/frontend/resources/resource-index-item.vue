<template>
  <div
    v-if="viewMode === 'grid'"
    class="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
  >
    <div v-if="resource.imageUrl" class="h-48 overflow-hidden bg-gray-100">
      <img
        :src="resource.imageUrl"
        :alt="resource.title"
        class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div
      v-else
      class="flex h-48 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
    >
      <component
        :is="iconFor(resource.type)"
        class="size-8 text-gray-400"
        aria-hidden="true"
      />
    </div>

    <div class="grid min-h-0 flex-1 grid-rows-[1fr_auto] p-5">
      <div class="mb-2 min-h-0">
        <h3 class="mb-2 line-clamp-2 text-base font-semibold text-gray-900">
          {{ resource.title }}
        </h3>

        <p
          v-if="resource.description"
          class="line-clamp-2 min-h-10 text-sm leading-5 text-gray-500"
        >
          {{ resource.description }}
        </p>
        <div v-else class="min-h-10" aria-hidden="true" />
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <div v-if="resource.label" class="flex min-w-0 items-center gap-2">
          <Tag class="size-3 shrink-0 text-gray-400" aria-hidden="true" />
          <span class="truncate text-xs text-gray-500">{{ resource.label }}</span>
        </div>

        <div
          class="flex shrink-0 items-center gap-2"
          :class="{ 'ml-auto': !resource.label }"
        >
          <span
            v-if="resource.url"
            class="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
          >
            <ExternalLink class="size-3" aria-hidden="true" />
          </span>
          <ResourceTypeBadge :type="resource.type" />
          <span
            v-if="resource.visibility !== 'public'"
            class="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-700"
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
                <MenuItem v-if="resource.url" v-slot="{ active }">
                  <button
                    type="button"
                    :class="[
                      active ? 'bg-gray-50' : '',
                      'flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700',
                    ]"
                    @click="emit('preview', resource)"
                  >
                    <Eye class="size-4" aria-hidden="true" />
                    Preview
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
    <td class="max-w-0 px-6 py-4">
      <div class="flex items-center gap-3">
        <ResourceThumbnail :item="resource" />
        <div class="min-w-0">
          <h4 class="truncate text-sm font-medium text-gray-900">{{ resource.title }}</h4>
          <p v-if="resource.description" class="truncate text-xs text-gray-500">
            {{ resource.description }}
          </p>
        </div>
      </div>
    </td>
    <td class="whitespace-nowrap px-6 py-4">
      <ResourceTypeBadge :type="resource.type" />
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
      {{ resource.label || '—' }}
    </td>
    <td class="whitespace-nowrap px-6 py-4">
      <span
        class="rounded px-2 py-1 text-xs font-medium capitalize"
        :class="
          resource.visibility === 'public'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'
        "
      >
        {{ resource.visibility }}
      </span>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
      {{ resource.updatedAt }}
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
          v-if="resource.url"
          type="button"
          class="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          @click="emit('preview', resource)"
        >
          <Eye class="size-4" aria-hidden="true" />
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
  Eye,
  FileText,
  MoreVertical,
  SquarePen,
  Tag,
  Trash2,
  Video,
} from '@lucide/vue';
import type { Component } from 'vue';
import type { ResourceIndexItem, ResourceType } from '../../types';
import ResourceThumbnail from '../stories/components/resource-thumbnail.vue';
import ResourceTypeBadge from '../stories/components/resource-type-badge.vue';

defineProps<{
  resource: ResourceIndexItem;
  viewMode: 'grid' | 'list';
}>();

const emit = defineEmits<{
  edit: [id: string];
  preview: [resource: ResourceIndexItem];
  delete: [id: string];
}>();

const iconFor = (type: ResourceType): Component => {
  switch (type) {
    case 'video':
      return Video;
    case 'info_link':
      return ExternalLink;
    case 'text':
    default:
      return FileText;
  }
};
</script>
