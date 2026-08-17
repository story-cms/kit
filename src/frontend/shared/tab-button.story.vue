<template>
  <Story title="Tab Button" group="shared" :layout="{ type: 'grid', width: 420 }">
    <Variant title="Label only">
      <div class="flex flex-wrap gap-1 bg-white p-8">
        <TabButton
          v-for="tab in labelTabs"
          :key="tab"
          :is-active="tab === activeLabelTab"
          @click="activeLabelTab = tab"
        >
          {{ tab }}
        </TabButton>
      </div>
    </Variant>

    <Variant title="With count badge (index-filter usage)">
      <div class="flex flex-wrap gap-1 bg-white p-8">
        <TabButton
          v-for="tab in countTabs"
          :key="tab.label"
          :is-active="tab.label === activeCountTab"
          @click="activeCountTab = tab.label"
        >
          {{ tab.label }}
          <span
            class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
            :class="
              tab.label === activeCountTab
                ? 'bg-studio-green text-studio-forest'
                : 'bg-gray-100 text-gray-500'
            "
          >
            {{ tab.count }}
          </span>
        </TabButton>
      </div>
    </Variant>

    <Variant title="With sort icon (ui-toolbar / story-gallery usage)">
      <div class="flex flex-wrap gap-1 bg-white p-8">
        <TabButton
          v-for="tab in sortTabs"
          :key="tab.label"
          :label="tab.label"
          :is-active="sortField === tab.field"
          @click="onToggleSort(tab.field)"
        >
          <ArrowDownWideNarrow
            v-if="sortField === tab.field && sortDescending"
            class="size-4"
            aria-hidden="true"
          />
          <ArrowUpWideNarrow v-else class="size-4" aria-hidden="true" />
        </TabButton>
      </div>
    </Variant>

    <Variant title="Section nav with icons (tab-navigation usage)">
      <div class="flex flex-wrap gap-1 bg-white p-8">
        <TabButton
          v-for="tab in sectionTabs"
          :key="tab.label"
          :label="tab.label"
          :is-active="tab.label === activeSectionTab"
          @click="activeSectionTab = tab.label"
        >
          <component :is="tab.icon" class="size-4" aria-hidden="true" />
        </TabButton>
      </div>
    </Variant>

    <Variant title="With errors">
      <div class="flex flex-wrap gap-1 bg-white p-8">
        <TabButton
          v-for="tab in errorTabs"
          :key="tab.label"
          :label="tab.label"
          :is-active="tab.label === activeErrorTab"
          :has-error="tab.hasError"
          @click="activeErrorTab = tab.label"
        >
          <component :is="tab.icon" class="size-4" aria-hidden="true" />
        </TabButton>
      </div>
    </Variant>

    <Variant title="Non-interactive display (translation-index usage)">
      <div class="flex flex-wrap gap-1 bg-white p-8">
        <TabButton :label="sourceLanguage" :is-active="false" :is-action="false">
          <Eye aria-hidden="true" class="size-4" />
        </TabButton>
      </div>
    </Variant>

    <Variant title="Toggle with aria-pressed (translation-index usage)">
      <div class="flex flex-wrap gap-1 bg-white p-8">
        <TabButton
          :label="targetLanguage"
          :is-active="showSourceColumn"
          :aria-pressed="showSourceColumn"
          @click="showSourceColumn = !showSourceColumn"
        >
          <Eye v-if="showSourceColumn" aria-hidden="true" class="size-4" />
          <EyeOff v-else aria-hidden="true" class="size-4" />
        </TabButton>
      </div>
    </Variant>

    <Variant title="Disabled">
      <div class="flex flex-wrap gap-1 bg-white p-8">
        <TabButton label="Active, disabled" :is-active="true" :disabled="true" />
        <TabButton label="Inactive, disabled" :is-active="false" :disabled="true" />
      </div>
    </Variant>

    <Variant title="All states">
      <div class="flex flex-wrap gap-2">
        <TabButton label="Inactive">
          <Folder class="size-4" aria-hidden="true" />
        </TabButton>
        <TabButton label="Active" :is-active="true">
          <Folder class="size-4" aria-hidden="true" />
        </TabButton>
        <TabButton label="Inactive, error" :has-error="true">
          <Folder class="size-4" aria-hidden="true" />
        </TabButton>
        <TabButton label="Active, error" :is-active="true" :has-error="true">
          <Folder class="size-4" aria-hidden="true" />
        </TabButton>
        <TabButton label="Disabled" :disabled="true">
          <Folder class="size-4" aria-hidden="true" />
        </TabButton>
        <TabButton :is-action="false" label="Non-interactive">
          <Folder class="size-4" aria-hidden="true" />
        </TabButton>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  BookOpen,
  Eye,
  EyeOff,
  Folder,
  LayoutList,
} from '@lucide/vue';
import TabButton from './tab-button.vue';

const labelTabs = ['All', 'Published', 'Drafts'];
const activeLabelTab = ref('All');

const countTabs = [
  { label: 'All', count: 156 },
  { label: 'Published', count: 98 },
  { label: 'Drafts', count: 58 },
];
const activeCountTab = ref('All');

const sortTabs: { label: string; field: 'lastEdited' | 'status' }[] = [
  { label: 'Last Edited', field: 'lastEdited' },
  { label: 'Status', field: 'status' },
];
const sortField = ref<'lastEdited' | 'status'>('lastEdited');
const sortDescending = ref(true);
const onToggleSort = (field: 'lastEdited' | 'status') => {
  if (sortField.value === field) {
    sortDescending.value = !sortDescending.value;
    return;
  }
  sortField.value = field;
  sortDescending.value = true;
};

const sectionTabs = [
  { label: 'Details', icon: BookOpen },
  { label: 'Sections', icon: LayoutList },
  { label: 'Resources', icon: Folder },
];
const activeSectionTab = ref('Sections');

const errorTabs = [
  { label: 'Details', icon: BookOpen, hasError: true },
  { label: 'Sections', icon: LayoutList, hasError: true },
  { label: 'Resources', icon: Folder, hasError: false },
];
const activeErrorTab = ref('Details');

const sourceLanguage = 'English';
const targetLanguage = 'French';
const showSourceColumn = ref(true);
</script>

<docs lang="md">
# Tab Button

Shared pill-shaped button used to build tab-like controls: filter tabs
(`index-filter.vue`), editor sidebar sections (`tab-navigation.vue`),
toolbar sort toggles (`ui-toolbar.vue`, `story-gallery.vue`), and
translation column visibility toggles (`translation-index.vue`).

## Props

- `label` — optional text rendered after the default slot; usages that need
  the label inside slot content (e.g. filter tab counts) omit this and put
  text directly in the slot instead.
- `isActive` — highlights the button as the current selection.
- `hasError` — shows an error indicator dot and error coloring.
- `isAction` — `true` (default) renders a clickable `<button>`; `false`
  renders a non-interactive `<span>`.
- `disabled` — disables the button when `isAction` is `true`.

## Events

- `click` — emitted when an enabled, actionable button is clicked.
</docs>
