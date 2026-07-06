<template>
  <Story title="Expandable Search" group="shared" :layout="{ type: 'grid', width: 500 }">
    <Variant title="Expanded">
      <div class="flex items-center gap-3 bg-gray-50 p-6" style="width: 400px">
        <ExpandableSearch v-model="query" placeholder="Search resources..." />
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
          class="flex items-center gap-3 overflow-hidden rounded-xl border border-dashed border-gray-300 p-3"
          :style="{ width: `${containerWidth}px` }"
        >
          <ExpandableSearch
            v-model="interactiveQuery"
            placeholder="Search..."
            clear-on-collapse
          />
          <div
            class="flex shrink-0 items-center rounded-xl border border-gray-300 bg-white p-1"
            aria-hidden="true"
          >
            <div class="rounded-xl bg-gray-100 p-2">
              <LayoutGrid class="size-4 text-gray-900" />
            </div>
          </div>
        </div>
        <p class="text-sm text-gray-600">Value: "{{ interactiveQuery }}"</p>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { LayoutGrid } from '@lucide/vue';
import { ref } from 'vue';
import ExpandableSearch from './expandable-search.vue';

const query = ref('');
const idleQuery = ref('');
const interactiveQuery = ref('');
const containerWidth = ref(200);
</script>
