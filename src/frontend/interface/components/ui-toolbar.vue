<template>
  <div class="mb-2 w-full bg-gray-50">
    <div class="flex items-center justify-between py-4">
      <div class="flex items-center gap-x-4">
        <span class="isolate inline-flex rounded-md shadow-sm">
          <button
            type="button"
            :class="[
              'relative inline-flex items-center rounded-l-md border-r px-4 py-2 text-sm font-medium leading-4 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 disabled:cursor-not-allowed',
              activeFilter === 'todo'
                ? 'bg-indigo-50 text-indigo-700 ring-indigo-700'
                : 'bg-white text-gray-900',
            ]"
            @click="$emit('update:activeFilter', 'todo')"
          >
            To do
            <span
              class="ml-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium leading-4 text-indigo-700"
              >{{ shared.uiTodos }}</span
            >
          </button>

          <button
            type="button"
            :class="[
              'relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium leading-4 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10',
              activeFilter === 'all'
                ? 'bg-indigo-50 text-indigo-700 ring-indigo-700'
                : 'bg-white text-gray-900',
            ]"
            @click="$emit('update:activeFilter', 'all')"
          >
            All
            <span
              class="ml-4 inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium leading-4 text-gray-700"
              >{{ allCount }}</span
            >
          </button>
        </span>
        <button
          type="button"
          :class="[
            'inline-flex items-center gap-x-2 rounded-full px-3.5 py-2.5 text-sm font-medium shadow-sm ring-1 ring-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            sortBy?.field === 'lastEdited'
              ? 'bg-indigo-50 text-indigo-700 ring-indigo-700'
              : 'bg-white text-indigo-700 ring-indigo-700 hover:bg-indigo-100',
          ]"
          @click="$emit('sort', 'lastEdited')"
        >
          <Icon name="sort" />
          Last Edited
        </button>
        <button
          type="button"
          :class="[
            'inline-flex items-center gap-x-2 rounded-full px-3.5 py-2.5 text-sm font-medium shadow-sm ring-1 ring-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            sortBy?.field === 'status'
              ? 'bg-indigo-50 text-indigo-700 ring-indigo-700'
              : 'bg-white text-indigo-700 ring-indigo-700 hover:bg-indigo-100',
          ]"
          @click="$emit('sort', 'status')"
        >
          <Icon name="sort" />
          Status
        </button>
      </div>
      <div>
        <div class="mt-2 grid grid-cols-1">
          <input
            type="text"
            name="search"
            id="search"
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6"
            placeholder="Search"
          />
          <svg
            class="pointer-events-none col-start-1 row-start-1 ml-4 size-4 self-center text-gray-400"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2ZM0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6C12 7.29583 11.5892 8.49572 10.8907 9.47653L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L9.47653 10.8907C8.49572 11.5892 7.29583 12 6 12C2.68629 12 0 9.31371 0 6Z"
              fill="#374151"
            />
          </svg>
        </div>
      </div>
    </div>
    <hr class="w-full" />
  </div>
</template>

<script setup lang="ts">
import Icon from '../../shared/icon.vue';
import { useSharedStore } from '../../store';

const shared = useSharedStore();

defineProps<{
  modelValue: string;
  allCount: number;
  activeFilter: 'todo' | 'all';
  sortBy: {
    field: 'status' | 'lastEdited';
  };
}>();

defineEmits<{
  'update:modelValue': [value: string];
  'update:activeFilter': [value: 'todo' | 'all'];
  sort: [field: 'status' | 'lastEdited'];
}>();
</script>
