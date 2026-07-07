<template>
  <Story title="Expandable Search" group="shared" :layout="{ type: 'grid', width: 500 }">
    <Variant title="Expanded">
      <div class="flex items-center gap-3 bg-gray-50 p-6" style="width: 400px">
        <ExpandableSearch
          v-model="query"
          placeholder="Search resources to attach..."
        />
      </div>
    </Variant>

    <Variant title="With value">
      <div class="flex items-center gap-3 bg-gray-50 p-6" style="width: 400px">
        <ExpandableSearch v-model="filledQuery" placeholder="Search" />
      </div>
    </Variant>

    <Variant title="Compact">
      <div class="flex items-center gap-3 bg-gray-50 p-6" style="width: 80px">
        <ExpandableSearch v-model="query" placeholder="Search" />
      </div>
    </Variant>

    <Variant title="Compact with idle close">
      <div class="space-y-2 bg-gray-50 p-6" style="width: 80px">
        <ExpandableSearch v-model="idleQuery" placeholder="Search" clear-on-collapse />
        <p class="text-xs text-gray-500">
          Click the icon to open. Closes after 5s without typing, or on click-away.
        </p>
        <p class="text-xs text-gray-600">Value: "{{ idleQuery }}"</p>
      </div>
    </Variant>

    <Variant title="Interactive">
      <div class="space-y-4 bg-gray-50 p-6">
        <label class="block text-sm text-gray-600">
          Container width: {{ containerWidth }}px
          <input
            v-model.number="containerWidth"
            type="range"
            min="60"
            max="480"
            step="10"
            class="mt-2 w-full"
          />
        </label>
        <div
          class="flex flex-wrap items-center gap-[10px] overflow-hidden rounded-xl border border-dashed border-gray-300 p-3"
          :style="{ width: `${containerWidth}px` }"
        >
          <ExpandableSearch
            v-model="interactiveQuery"
            placeholder="Search..."
            clear-on-collapse
          />
          <button
            v-for="letter in letters"
            :key="letter"
            type="button"
            class="flex size-7 shrink-0 items-center justify-center rounded-full p-0 text-sm text-gray-500"
            aria-hidden="true"
          >
            {{ letter }}
          </button>
        </div>
        <p class="text-sm text-gray-600">Value: "{{ interactiveQuery }}"</p>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ExpandableSearch from './expandable-search.vue';

const query = ref('');
const filledQuery = ref('Portuguese');
const idleQuery = ref('');
const interactiveQuery = ref('');
const containerWidth = ref(200);
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
</script>
