<template>
  <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
    <div class="flex flex-wrap items-center gap-3">
      <IndexFilter
        :tabs="filterTabs"
        :current-tab="currentFilterTab"
        @change="onFilterChange"
      />
      <nav aria-label="Sort strings">
        <div class="flex flex-wrap gap-1">
          <TabButton
            label="Last Edited"
            :is-active="sortField === 'lastEdited'"
            @click="emit('sort', 'lastEdited')"
          >
            <ArrowDownWideNarrow
              v-if="sortField === 'lastEdited' && sortDescending"
              class="size-4"
              aria-hidden="true"
            />
            <ArrowUpWideNarrow v-else class="size-4" aria-hidden="true" />
          </TabButton>
          <TabButton
            label="Status"
            :is-active="sortField === 'status'"
            @click="emit('sort', 'status')"
          >
            <ArrowDownWideNarrow
              v-if="sortField === 'status' && sortDescending"
              class="size-4"
              aria-hidden="true"
            />
            <ArrowUpWideNarrow v-else class="size-4" aria-hidden="true" />
          </TabButton>
        </div>
      </nav>
    </div>

    <div class="flex shrink-0 items-center gap-3">
      <ExpandableSearch
        :model-value="modelValue"
        placeholder="Search"
        clear-on-collapse
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from '@lucide/vue';
import IndexFilter from '../../shared/index-filter.vue';
import TabButton from '../../shared/tab-button.vue';
import ExpandableSearch from '../../shared/expandable-search.vue';

const props = defineProps<{
  modelValue: string;
  allCount: number;
  todoCount: number;
  activeFilter: 'todo' | 'all';
  sortField: 'status' | 'lastEdited';
  sortDescending: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:activeFilter': [value: 'todo' | 'all'];
  sort: [field: 'status' | 'lastEdited'];
}>();

const filterTabs = computed(() => [
  { label: 'To do', count: props.todoCount },
  { label: 'All', count: props.allCount },
]);

const currentFilterTab = computed(() =>
  props.activeFilter === 'todo' ? 'To do' : 'All',
);

const onFilterChange = (tab: string) => {
  emit('update:activeFilter', tab === 'To do' ? 'todo' : 'all');
};
</script>
