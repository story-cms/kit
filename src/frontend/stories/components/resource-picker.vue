<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <div class="relative flex-1">
        <Search
          class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          class="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search resources to attach..."
          @focus="showSearch = true"
          @input="showSearch = true"
        />
      </div>
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
        @click="emit('create')"
      >
        <Plus class="size-4" />
        Create New Resource
      </button>
    </div>

    <div
      v-if="showSearchPanel"
      class="max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
    >
      <div
        class="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2"
      >
        <span class="text-sm font-medium text-gray-700">
          Available Resources ({{ filteredAvailableResources.length }})
        </span>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600"
          aria-label="Close search results"
          @click="closeSearch"
        >
          <X class="size-4" />
        </button>
      </div>
      <div class="divide-y divide-gray-100">
        <div
          v-for="libraryItem in filteredAvailableResources"
          :key="libraryItem.id"
          class="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
        >
          <ResourceThumbnail :item="libraryItem" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <h4 class="truncate text-sm font-medium text-gray-900">
                {{ libraryItem.title }}
              </h4>
              <ResourceTypeBadge :type="libraryItem.resourceType" />
            </div>
            <p v-if="libraryItem.description" class="mt-1 truncate text-xs text-gray-500">
              {{ libraryItem.description }}
            </p>
            <div class="mt-1 flex items-center gap-2">
              <Tag class="size-3 text-gray-400" aria-hidden="true" />
              <span class="text-xs text-gray-500">{{ libraryItem.label }}</span>
            </div>
          </div>
          <button
            type="button"
            class="shrink-0 rounded bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
            @click="attach(libraryItem)"
          >
            Attach
          </button>
        </div>
        <div
          v-if="filteredAvailableResources.length === 0"
          class="px-4 py-8 text-center text-sm text-gray-500"
        >
          No resources found matching "{{ searchQuery }}"
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, Search, Tag, X } from '@lucide/vue';
import ResourceThumbnail from './resource-thumbnail.vue';
import ResourceTypeBadge from './resource-type-badge.vue';
import type { Resource } from '../../../types';

const props = defineProps<{
  availableResources: Resource[];
  attachedResources: Resource[];
}>();

const emit = defineEmits<{
  attach: [resource: Resource];
  create: [];
}>();

const searchQuery = ref('');
const showSearch = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

const attachedIds = computed(
  () => new Set(props.attachedResources.map((resource) => resource.id)),
);

const filteredAvailableResources = computed(() =>
  props.availableResources
    .filter((resource) => !attachedIds.value.has(resource.id))
    .filter((resource) => {
      const query = searchQuery.value.trim().toLowerCase();
      if (!query) return true;

      return (
        resource.title.toLowerCase().includes(query) ||
        resource.label.toLowerCase().includes(query) ||
        resource.description?.toLowerCase().includes(query)
      );
    }),
);

const showSearchPanel = computed(
  () =>
    showSearch.value &&
    (searchQuery.value.length > 0 || filteredAvailableResources.value.length > 0),
);

const attach = (resource: Resource) => {
  emit('attach', resource);
  searchQuery.value = '';
  showSearch.value = false;
};

const closeSearch = () => {
  showSearch.value = false;
  searchQuery.value = '';
};

const openSearch = () => {
  showSearch.value = true;
  searchInput.value?.focus();
};

defineExpose({ openSearch });
</script>
