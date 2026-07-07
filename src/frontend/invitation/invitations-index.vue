<template>
  <AppLayout title="Invitations" subtitle="Manage Invitations">
    <template #actions>
      <StudioButton label="Create Invitation" variant="secondary" @click="addInvitation">
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
              placeholder="Search invitations..."
              class="w-full rounded-xl border border-gray-300 py-2.5 pl-11 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <button
              type="button"
              class="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
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

        <div v-if="showFilters" class="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label class="mb-2 block text-xs font-medium text-gray-700">Status</label>
              <select
                v-model="filterStatus"
                class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="Live">Live</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #main>
      <section>
        <div class="mb-4 flex items-center justify-between">
          <p class="text-sm text-gray-600">
            <span class="font-medium">{{ filteredItems.length }}</span>
            invitation{{ filteredItems.length !== 1 ? 's' : '' }} found
          </p>
        </div>

        <div
          v-if="filteredItems.length > 0 && !isList"
          class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <InvitationIndexItem
            v-for="item in filteredItems"
            :key="item.id"
            class="h-full"
            :invitation="item"
            view-mode="grid"
            @edit="editInvitation"
          />
        </div>

        <div
          v-else-if="filteredItems.length > 0 && isList"
          class="overflow-x-auto rounded-xl border border-gray-200 bg-white"
        >
          <table class="w-full min-w-[720px] table-auto">
            <thead class="border-b border-gray-200 bg-gray-50">
              <tr>
                <th
                  class="max-w-[400px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Invitation
                </th>
                <th
                  class="max-w-[200px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Regions
                </th>
                <th
                  class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Start
                </th>
                <th
                  class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  End
                </th>
                <th
                  class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
                <th
                  class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <InvitationIndexItem
                v-for="item in filteredItems"
                :key="item.id"
                :invitation="item"
                view-mode="list"
                @edit="editInvitation"
              />
            </tbody>
          </table>
        </div>

        <div v-else>
          <h3 class="mb-2 text-lg font-medium text-gray-900">No invitations found</h3>
          <p class="text-sm text-gray-500">
            {{
              items.length === 0
                ? 'Get started by creating your first invitation'
                : 'Try adjusting your search or filters'
            }}
          </p>
        </div>
      </section>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { Plus, Search, SlidersHorizontal } from '@lucide/vue';
import type { InvitationItem, SharedPageProps, InvitationIndexProps } from '../../types';
import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import StudioButton from '../shared/studio-button.vue';
import ListSwitcher from '../shared/list-switcher.vue';
import InvitationIndexItem from './invitation-index-item.vue';
import { getInvitationStatus, padZero } from '../shared/helpers';

type FilterStatus = 'all' | 'Draft' | 'Scheduled' | 'Completed' | 'Live';

const props = defineProps<InvitationIndexProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const items = ref<InvitationItem[]>([...props.invitations]);
const searchQuery = ref('');
const isList = ref(false);
const showFilters = ref(false);
const filterStatus = ref<FilterStatus>('all');

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase();

  return items.value.filter((item) => {
    const name =
      item.name === null || item.name === undefined || item.name === ''
        ? `invitation ${padZero(item.id)}`
        : item.name;

    const matchesSearch =
      !query ||
      name.toLowerCase().includes(query) ||
      item.regions?.toLowerCase().includes(query);

    const status = getInvitationStatus(item.isPublished, item.window ?? '');
    const matchesStatus = filterStatus.value === 'all' || status === filterStatus.value;

    return matchesSearch && matchesStatus;
  });
});

const addInvitation = () => {
  router.visit(`/${shared.locale}/invitation/create`);
};

const editInvitation = (id: number) => {
  router.visit(`/${shared.locale}/invitation/${id}/edit`);
};
</script>
