<template>
  <AppLayout>
    <template #header>
      <ContentHeader :title="`Interface: ${language.language}`">
        <template #extra-actions>
          <UiToolbar
            v-model="searchTerm"
            :all-count="props.items.length"
            :active-filter="activeFilter"
            :sort-by="sortBy"
            @update:active-filter="activeFilter = $event"
            @sort="handleSort"
          />
        </template>
      </ContentHeader>
    </template>
    <section>
      <div
        class="grid grid-cols-[2fr_4fr] gap-x-6"
        :style="{ height: `calc(100vh - (${headerHeight}px + 1rem))` }"
      >
        <div class="scrollbar-hide overflow-y-auto">
          <div v-if="hasEmptyItems" class="sticky top-0 bg-gray-50">
            <button
              v-show="todoCount"
              type="button"
              class="mb-4 flex w-full items-center justify-center gap-x-2 rounded-full py-[11px] text-sm font-medium leading-4 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              :class="{
                'bg-blue-50': isTranslating,
                'bg-white': !isTranslating,
              }"
              @click="translateItems"
            >
              <Icon class="size-4 text-gray-800" name="sparkles" />
              <span>
                {{
                  isTranslating
                    ? 'Translation in progress...'
                    : 'AI translate to do items'
                }}
              </span>
            </button>
          </div>
          <div class="overflow-hidden rounded-lg bg-white shadow">
            <UiStringItem
              v-for="item in filteredItems"
              v-show="filteredItems.length"
              :key="item.key"
              :item="item"
              :is-selected="selectedItem?.key === item.key"
              @click="selectItem(item)"
            />
          </div>
        </div>
        <div>
          <template v-if="filteredItems.length">
            <form v-if="!isTranslating">
              <UiCard
                v-if="selectedItem"
                :key="selectedItem.key"
                v-model:model="model[selectedItem.key]"
                :item="selectedItem"
                :error="itemError"
                @flagged="handleFlagged"
                @set-flag="setFlag"
                @save="save"
                @apply-suggestion="handleApplySuggestion"
              />
            </form>
            <div v-else class="grid h-full w-full place-content-center">
              <RivePlayer
                url="https://res.cloudinary.com/redeem/raw/upload/v1743751242/story-cms-ui/audio_visualizer_resize_teno9b.riv"
              />
            </div>
          </template>
          <div v-else class="py-10 text-gray-500">
            <p v-if="searchTerm" class="text-center text-sm">
              No results found for "{{ searchTerm }}"
            </p>
          </div>
        </div>
        <div
          v-if="activeFilter === 'todo' && !todoCount && !searchTerm"
          class="col-span-2 row-start-1 flex flex-col items-center justify-center"
        >
          <Icon class="size-96" name="inbox-zero" />
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import axios from 'axios';
import { router } from '@inertiajs/vue3';
import { AxiosError } from 'axios';

import ContentHeader from '../shared/content-header.vue';
import UiToolbar from './components/ui-toolbar.vue';
import UiStringItem from './components/ui-string-item.vue';
import UiCard from './components/ui-card.vue';

import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import { ResponseStatus, FlagState } from '../../types';
import type { UiItem, UiPageProps, SharedPageProps, UiItemPayload } from '../../types';
import Icon from '../shared/icon.vue';

import RivePlayer from '../fields/attachments/rive-player.vue';

type ModelType = { [key: string]: string | undefined };

const props = defineProps<SharedPageProps & UiPageProps>();

const searchTerm = ref('');
const itemError = ref('');
const todoCount = computed(() => {
  return props.items.filter((item) => !item.translation || !!item.flag).length;
});

const activeFilter = ref<'todo' | 'all'>('todo');
const sortBy = ref<{ field: 'status' | 'lastEdited' }>({
  field: 'lastEdited',
});

const hasEmptyItems = computed(() => {
  return props.items.some((item) => !item.translation);
});

const filteredItems = computed(() => {
  let items = props.items;

  if (activeFilter.value === 'todo') {
    items = items.filter((item) => !item.translation || !!item.flag);
  }

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    items = items.filter(
      (item) =>
        item.source.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.key.toLowerCase().includes(search),
    );
  }

  const sortByStatus = (a: UiItem, b: UiItem) => {
    if (a.flag === FlagState.RECHECK && b.flag !== FlagState.RECHECK) return -1;
    if (a.flag !== FlagState.RECHECK && b.flag === FlagState.RECHECK) return 1;

    if (a.flag === FlagState.PREFILLED && b.flag !== FlagState.PREFILLED) return -1;
    if (a.flag !== FlagState.PREFILLED && b.flag === FlagState.PREFILLED) return 1;

    const aTranslated = !!a.translation;
    const bTranslated = !!b.translation;
    if (aTranslated !== bTranslated) {
      return aTranslated ? 1 : -1;
    }

    return 0;
  };

  const sortByLastEdited = (a: UiItem, b: UiItem) => {
    if (!a.updatedAt && !b.updatedAt) return 0;
    if (!a.updatedAt) return 1;
    if (!b.updatedAt) return -1;
    return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime();
  };

  const sortFunction =
    sortBy.value.field === 'status'
      ? sortByStatus
      : sortBy.value.field === 'lastEdited'
        ? sortByLastEdited
        : (a: UiItem, b: UiItem) => {
            const aTranslated = !!a.translation;
            const bTranslated = !!b.translation;
            if (aTranslated !== bTranslated) {
              return aTranslated ? 1 : -1;
            }

            if (a.flag === FlagState.RECHECK && b.flag !== FlagState.RECHECK) return -1;
            if (a.flag !== FlagState.RECHECK && b.flag === FlagState.RECHECK) return 1;
            if (a.flag === FlagState.PREFILLED && b.flag !== FlagState.PREFILLED)
              return -1;
            if (a.flag !== FlagState.PREFILLED && b.flag === FlagState.PREFILLED)
              return 1;

            return 0;
          };

  return items.sort(sortFunction);
});

const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');

const headerHeight = computed(() => shared.headerHeight);

watch(todoCount, (newCount) => {
  shared.setUiTodoCount(newCount);
});

const listToMap = (list: UiItem[]): ModelType => {
  const map: ModelType = {};
  for (const item of list) {
    const key = item.key;
    map[key] = item.translation;
  }
  return map;
};

const startValues = listToMap(props.items);
const model = reactive(startValues);

const selectedItem = ref<UiItem | null>(null);

watch(
  [filteredItems],
  () => {
    if (
      filteredItems.value.length &&
      (!selectedItem.value ||
        !filteredItems.value.some((item) => item.key === selectedItem.value?.key))
    ) {
      selectedItem.value = filteredItems.value[0];
    }
  },
  { immediate: true },
);

const selectItem = (item: UiItem) => {
  selectedItem.value = item;
};

const isTranslating = ref(false);

const setFlag = async (key: string, state: FlagState) => {
  const item = props.items.find((item) => item.key === key);
  const newState = item?.flag === state ? null : state;

  try {
    const response = await axios.post(`/${shared.locale}/ui/flag`, {
      key: key,
      state: newState,
    });
    if (response.status === 200) {
      router.reload({ only: ['ui', 'items'] });
      shared.addMessage(
        ResponseStatus.Accomplishment,
        newState ? 'Flag set' : 'Flag removed',
      );
    }
  } catch (error) {
    console.error(error);
    shared.addMessage(ResponseStatus.Failure, 'Error updating flag');
  }
};

const save = async (payload: UiItemPayload) => {
  try {
    const response = await axios.post(`/${shared.locale}/ui`, payload);
    if (response.status === 200) {
      router.reload({ only: ['ui', 'items'] });
      shared.addMessage(ResponseStatus.Accomplishment, 'Translation saved');
    }
  } catch (error) {
    shared.addMessage(ResponseStatus.Failure, 'Error saving translation');
    itemError.value =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      'Error saving translation';
  }
};

const translateItems = async () => {
  if (isTranslating.value) return;

  isTranslating.value = true;
  const itemsToTranslate = props.items.filter((item) => !item.translation);

  const payload = itemsToTranslate.reduce(
    (acc, item) => {
      acc[item.key] = '';
      return acc;
    },
    {} as Record<string, string>,
  );
  try {
    const response = await axios.post(`/${shared.locale}/ui/translate-bulk`, payload);

    if (response.status === 200) {
      router.reload({ only: ['ui', 'items'] });
      shared.addMessage(ResponseStatus.Accomplishment, 'Items translated successfully');
    }
  } catch (error) {
    console.error(error);
    shared.addMessage(ResponseStatus.Failure, 'Failed to translate items');
  } finally {
    isTranslating.value = false;
    router.visit(window.location.href, {
      only: ['items'],
      preserveScroll: true,
    });
  }
};

const handleFlagged = (key: string) => {
  const currentIndex = filteredItems.value.findIndex((item) => item.key === key);
  if (currentIndex !== -1 && currentIndex < filteredItems.value.length - 1) {
    selectedItem.value = filteredItems.value[currentIndex + 1];
  }
};

const handleApplySuggestion = (suggestion: string) => {
  if (!selectedItem.value) return;

  model[selectedItem.value.key] = suggestion;

  save({
    key: selectedItem.value.key,
    locale: shared.locale,
    translation: suggestion,
    isPrefilled: true,
  });
};

const handleSort = (field: 'status' | 'lastEdited') => {
  sortBy.value.field = field;
  if (filteredItems.value.length > 0) {
    selectedItem.value = filteredItems.value[0];
  }
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari and Opera */
}
</style>
