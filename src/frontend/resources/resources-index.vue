<template>
  <AppLayout title="Resource Library" subtitle="Manage Resources">
    <template #actions>
          <StudioButton
            label="Create Resource"
            variant="secondary"
            @click="createResource"
          >
            <Plus class="size-4" aria-hidden="true" />
          </StudioButton>
    </template>
    <template #controls>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <div class="relative flex-1">
                <Search
                  class="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search resources..."
                  class="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  class="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
                  :class="
                    showFilters
                      ? 'border-blue-200 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  "
                  @click="showFilters = !showFilters"
                >
                  <SlidersHorizontal class="size-4" aria-hidden="true" />
                  Filters
                </button>
                <ListSwitcher :is-list="isList" @toggle="isList = !isList" />
              </div>
            </div>

            <div
              v-if="showFilters"
              class="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label class="mb-2 block text-xs font-medium text-gray-700">Type</label>
                  <select
                    v-model="filterType"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="text">Article</option>
                    <option value="video">Video</option>
                    <option value="url">URL</option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-xs font-medium text-gray-700"
                    >Visibility</label
                  >
                  <select
                    v-model="filterVisibility"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Visibility</option>
                    <option value="public">Public</option>
                    <option value="guests">Guests</option>
                    <option value="leaders">Leaders</option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-xs font-medium text-gray-700"
                    >Label</label
                  >
                  <select
                    v-model="selectedLabel"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Labels</option>
                    <option v-for="label in allLabels" :key="label" :value="label">
                      {{ label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </template>

    <template #main>
    <section class="mt-3 px-3">
      <div class="mb-4 flex items-center justify-between">
        <p class="text-sm text-gray-600">
          <span class="font-medium">{{ filteredResources.length }}</span>
          resource{{ filteredResources.length !== 1 ? 's' : '' }} found
        </p>
      </div>

      <div
        v-if="filteredResources.length > 0 && !isList"
        class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <ResourceIndexItemCard
          v-for="resource in filteredResources"
          :key="resource.id"
          class="h-full"
          :resource="resource"
          view-mode="grid"
          @edit="editResource"
          @delete="deleteResource"
        />
      </div>

      <div
        v-else-if="filteredResources.length > 0 && isList"
        class="overflow-x-auto rounded-xl border border-gray-200 bg-white"
      >
        <table class="w-full min-w-[720px] table-auto">
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th
                class="max-w-[400px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Resource
              </th>
              <th
                class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Label
              </th>
              <th
                class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Type
              </th>
              <th
                class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Visibility
              </th>
              <th
                class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Updated
              </th>
              <th
                class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <ResourceIndexItemCard
              v-for="resource in filteredResources"
              :key="resource.id"
              :resource="resource"
              view-mode="list"
              @edit="editResource"
              @delete="deleteResource"
            />
          </tbody>
        </table>
      </div>

      <div v-else>
        <h3 class="mb-2 text-lg font-medium text-gray-900">No resources found</h3>
        <p class="text-sm text-gray-500">
          {{
            hasActiveFilters
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first resource'
          }}
        </p>
      </div>
    </section>

    <RemoveResourceModal
      :open="deleteModalResourceId !== null"
      @close="deleteModalResourceId = null"
      @confirm="confirmDeleteResource"
    />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { Plus, Search, SlidersHorizontal } from '@lucide/vue';
import {
  ResponseStatus,
  type ResourceIndexItem,
  type ResourceIndexProps,
  type ResourceType,
  type SharedPageProps,
  type VisibilityType,
} from '../../types';
import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import StudioButton from '../shared/studio-button.vue';
import ListSwitcher from '../shared/list-switcher.vue';
import ResourceIndexItemCard from './resource-index-item.vue';
import RemoveResourceModal from './remove-resource-modal.vue';
import { compareResourcesByRecentlyEdited } from '../stories/components/resource-utils';

type FilterType = 'all' | ResourceType;
type FilterVisibility = 'all' | VisibilityType;

const props = defineProps<ResourceIndexProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const items = ref<ResourceIndexItem[]>(
  [...props.resources].sort(compareResourcesByRecentlyEdited),
);
const searchQuery = ref('');
const isList = ref(false);
const showFilters = ref(false);
const filterType = ref<FilterType>('all');
const filterVisibility = ref<FilterVisibility>('all');
const selectedLabel = ref('all');
const deleteModalResourceId = ref<string | null>(null);

const allLabels = computed(() => {
  const labels = new Set<string>();
  for (const resource of items.value) {
    if (resource.label) labels.add(resource.label);
  }
  return Array.from(labels).sort();
});

const hasActiveFilters = computed(
  () =>
    Boolean(searchQuery.value) ||
    filterType.value !== 'all' ||
    filterVisibility.value !== 'all' ||
    selectedLabel.value !== 'all',
);

const filteredResources = computed(() => {
  const query = searchQuery.value.toLowerCase();

  return items.value
    .filter((resource) => {
      const matchesSearch =
        !query ||
        resource.title.toLowerCase().includes(query) ||
        resource.description?.toLowerCase().includes(query) ||
        resource.label?.toLowerCase().includes(query);

      const matchesType =
        filterType.value === 'all' || resource.type === filterType.value;
      const matchesVisibility =
        filterVisibility.value === 'all' ||
        resource.visibility === filterVisibility.value;
      const matchesLabel =
        selectedLabel.value === 'all' || resource.label === selectedLabel.value;

      return matchesSearch && matchesType && matchesVisibility && matchesLabel;
    })
    .sort(compareResourcesByRecentlyEdited);
});

const createResource = () => {
  router.visit(`/${shared.locale}/resource/create`);
};

const editResource = (id: string) => {
  router.visit(`/${shared.locale}/resource/${id}/edit`);
};

const deleteResource = (id: string) => {
  deleteModalResourceId.value = id;
};

const confirmDeleteResource = () => {
  const id = deleteModalResourceId.value;
  if (!id) return;

  router.delete(`/${shared.locale}/resource/${id}`, {
    onSuccess: () => {
      items.value = items.value.filter((item) => item.id !== id);
      deleteModalResourceId.value = null;
      shared.addMessage(ResponseStatus.Confirmation, 'Resource deleted');
    },
    onError: () => {
      deleteModalResourceId.value = null;
      shared.addMessage(ResponseStatus.Failure, 'Error deleting that resource');
    },
  });
};
</script>
