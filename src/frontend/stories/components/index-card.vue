<template>
  <div
    v-if="!isList"
    class="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
  >
    <button
      type="button"
      class="group/edit flex min-h-0 flex-1 flex-col text-left"
      @click="emit('tap', item)"
    >
      <div v-if="hasThumbnail" class="h-48 overflow-hidden bg-gray-100">
        <img
          :src="imgUrl"
          :alt="chapterLabel"
          class="size-full object-cover transition duration-300 group-hover/edit:scale-105 group-hover/edit:opacity-90"
        />
      </div>
      <div
        v-else
        class="flex h-48 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
      >
        <BookOpen
          class="size-8 text-gray-400 transition-opacity group-hover/edit:opacity-70"
          aria-hidden="true"
        />
      </div>

      <div class="min-h-0 flex-1 px-5 pt-5">
        <h3
          class="mb-2 line-clamp-2 text-base font-semibold text-gray-900 transition-opacity group-hover/edit:opacity-70"
        >
          {{ chapterLabel }}
        </h3>

        <p
          v-if="showSubtitle"
          class="line-clamp-2 min-h-10 text-sm leading-5 text-gray-500 transition-opacity group-hover/edit:opacity-70"
        >
          {{ title }}
        </p>
        <div v-else class="min-h-10" aria-hidden="true" />
      </div>
    </button>

    <div v-if="tags.length > 0" class="mt-2 px-5 pb-5">
      <div class="flex min-w-0 items-center gap-2 border-t border-gray-100 pt-3">
        <StatusTag v-for="tag in tags" :key="tag" :tag="tag" />
      </div>
    </div>
  </div>

  <tr v-else class="transition-colors hover:bg-gray-50">
    <td class="px-6 py-4">
      <div class="group/edit flex min-w-0 items-center gap-3">
        <button
          type="button"
          class="shrink-0 rounded-xl transition-opacity group-hover/edit:opacity-70"
          @click="emit('tap', item)"
        >
          <img
            v-if="hasThumbnail"
            :src="imgUrl"
            :alt="chapterLabel"
            draggable="false"
            class="size-12 shrink-0 rounded-xl object-cover"
          />
          <div
            v-else
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500"
          >
            <BookOpen class="size-4" aria-hidden="true" />
          </div>
        </button>
        <div class="min-w-0 flex-1">
          <button
            type="button"
            class="block w-full truncate text-left text-sm font-medium text-gray-900 transition-opacity group-hover/edit:opacity-70"
            @click="emit('tap', item)"
          >
            {{ chapterLabel }}
          </button>
          <button
            v-if="showSubtitle"
            type="button"
            class="block w-full truncate text-left text-xs text-gray-500 transition-opacity group-hover/edit:opacity-70"
            @click="emit('tap', item)"
          >
            {{ title }}
          </button>
        </div>
      </div>
    </td>
    <td class="whitespace-nowrap px-6 py-4">
      <div v-if="tags.length > 0" class="flex items-center gap-2">
        <StatusTag v-for="tag in tags" :key="tag" :tag="tag" />
      </div>
      <span v-else class="text-sm text-gray-400">—</span>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-right">
      <div class="flex items-center justify-end gap-2">
        <button
          v-if="canEdit"
          type="button"
          class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          aria-label="Edit"
          @click.stop="emit('edit', item)"
        >
          <SquarePen class="size-4" aria-hidden="true" />
        </button>
        <button
          v-if="hasLiveVersion"
          type="button"
          class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          aria-label="Preview"
          @click.stop="emit('preview', item)"
        >
          <Eye class="size-4" aria-hidden="true" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { BookOpen, Eye, SquarePen } from '@lucide/vue';
import type { PropType } from 'vue';
import { computed } from 'vue';
import StatusTag from '../../shared/status-tag.vue';
import type { IndexReadyItem } from '../../../types';
import { padZero } from '../../shared/helpers';

const props = defineProps({
  item: {
    type: Object as PropType<IndexReadyItem>,
    required: true,
  },
  isList: {
    type: Boolean,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
  placeholderImage: {
    type: String,
    default: '',
    required: false,
  },
  chapterName: {
    type: String,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['tap', 'edit', 'preview']);

const imgUrl = computed(() => props.item.imageUrl || props.placeholderImage);

const hasThumbnail = computed(() => !!(props.item.imageUrl || props.placeholderImage));

const title = computed(
  () => props.item.title || `${props.chapterName} ${props.item.number}`,
);

const showSubtitle = computed(() => !!props.item.title);

const chapterNumber = computed(() => padZero(props.item.number));

const chapterLabel = computed(() => `${props.chapterName} ${chapterNumber.value}`);

const hasLiveVersion = computed(() => props.item.tags.includes('Live'));

const tags = computed(() => {
  if (props.scope === 'Live' || props.scope === 'Ready') {
    if (props.item.tags.includes('Draft')) {
      return ['Changed'];
    }
  } else {
    if (props.scope === 'Changes' || props.item.tags.includes('Live')) {
      return ['Changes'];
    }
    return ['New'];
  }
  return [];
});
</script>
