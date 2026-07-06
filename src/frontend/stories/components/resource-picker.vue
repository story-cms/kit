<template>
  <div class="w-full min-w-0 space-y-6">
    <div class="flex min-w-0 items-center gap-3">
      <div class="relative min-w-0 flex-1 pl-[2px]">
        <Search
          class="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Search resources to attach..."
          class="w-full rounded-xl border border-gray-300 py-2.5 pl-11 pr-4 focus:border-transparent focus:ring-2 focus:ring-studio_forest_green"
          @focus="showSearch = true"
          @input="showSearch = true"
        />
      </div>
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-studio_forest_green px-4 py-2.5 text-sm font-medium text-studio_forest_green transition-colors hover:bg-studio_forest_green/10"
        @click="emit('create')"
      >
        <Plus class="size-4" />
        Create New Resource
      </button>
    </div>

    <div
      v-if="showSearchPanel"
      class="max-h-96 w-full overflow-y-auto overflow-x-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
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
      <div class="w-full divide-y divide-gray-100">
        <div
          v-for="libraryItem in filteredAvailableResources"
          :key="libraryItem.id"
          class="flex min-w-0 items-center gap-3 overflow-hidden px-4 py-3 transition-colors hover:bg-gray-50"
        >
          <ResourceThumbnail :item="libraryItem" />
          <div class="min-w-0 flex-1 basis-0 overflow-hidden">
            <div class="flex min-w-0 items-center gap-2 overflow-hidden">
              <h4 class="min-w-0 shrink truncate text-sm font-medium text-gray-900">
                {{ libraryItem.title }}
              </h4>
              <ResourceTypeBadge :type="libraryItem.type" />
            </div>
            <p
              v-if="libraryItem.description"
              class="mt-1 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500"
            >
              {{ libraryItem.description }}
            </p>
            <div class="mt-1 flex min-w-0 items-center gap-2">
              <Tag class="size-3 shrink-0 text-gray-400" aria-hidden="true" />
              <span class="truncate text-xs text-gray-500">{{
                libraryItem.label ?? 'Uncategorized'
              }}</span>
            </div>
          </div>
          <button
            type="button"
            class="shrink-0 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
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
import { compareResourcesByRecentlyEdited } from './resource-utils';
import type { ResourceItem } from '../../../types';

const props = defineProps<{
  availableResources: ResourceItem[];
  attachedResources: ResourceItem[];
}>();

const emit = defineEmits<{
  attach: [resource: ResourceItem];
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
        (resource.label ?? '').toLowerCase().includes(query) ||
        resource.description?.toLowerCase().includes(query)
      );
    })
    .sort(compareResourcesByRecentlyEdited),
);

const showSearchPanel = computed(
  () =>
    showSearch.value &&
    (searchQuery.value.length > 0 || filteredAvailableResources.value.length > 0),
);

const attach = (resource: ResourceItem) => {
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
