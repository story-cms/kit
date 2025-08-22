<template>
    <AppLayout>
      <template #header>
        <ContentHeader :title="stream.title">
          <template #actions>
            <div class="flex items-center gap-x-6 justify-center">
              <ListSwitcher :is-list="isList" @toggle="isList = !isList" />
  
              <IconButton icon="plus" @tap="addDrop" />
            </div>
          </template>
          <template #extra-actions>
            <div
              class="mb-4 flex flex-col justify-between gap-y-4 md:flex-row md:items-center md:gap-x-4"
            >
              <div class="flex gap-x-4">
                <IndexFilter :tabs="tabs" :current-tab="currentTab" @change="onFilter" />
                <ToggleButton
                  icon-on="sort"
                  icon-off="sort-asc"
                  label="Release Date"
                  :is-on="sortDescending"
                  @toggle="sortDescending = !sortDescending"
                  :is-active="true"
                />
              </div>
  
              <div class="grid grid-cols-1">
                <input
                  id="search"
                  v-model="wordFilter"
                  type="text"
                  name="search"
                  class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6"
                  :placeholder="meta.name"
                />
                <Icon
                  name="search"
                  class="pointer-events-none col-start-1 row-start-1 ml-4 size-4 self-center text-gray-400"
                />
              </div>
            </div>
          </template>
        </ContentHeader>
      </template>
  
      <section>
        <div
          class="my-8 flex gap-x-[26px]"
          :class="isList ? 'flex-col gap-y-6' : 'flex-wrap gap-y-[98px]'"
        >
          <a
            :href="`/${shared.locale}/drop/${drop.id}/edit`"
            v-for="drop in displayIndex"
            :key="drop.id"
            :class="isList ? 'w-full' : 'max-w-64'"
          >
            <DropItem
              :drop="drop"
              :is-list="isList"
              :placeholder-image="'https://res.cloudinary.com/onesheep/image/upload/v1684754051/Screenshot_2023-05-22_at_13.12.03_pnamdt.png'"
            />
          </a>
        </div>
      </section>
    </AppLayout>
  </template>
  
  <script setup lang="ts">
  import { SharedPageProps } from '@story-cms/kit';
  import { router, useSharedStore, IndexFilter, ToggleButton } from '@story-cms/kit/ui';
  
  import { AppLayout, Icon, ContentHeader } from '@story-cms/kit/ui';
  import { computed, ref } from 'vue';
  import { DropIndexItem, StreamIndexProps } from '../../types';
  import DropItem from './components/drop-item.vue';
  import ListSwitcher from '../shared/list-switcher.vue';
  import IconButton from '../shared/icon-button.vue';
  
  const props = defineProps<StreamIndexProps & SharedPageProps>();
  const shared = useSharedStore();
  shared.setFromProps(props);
  
  // sorting
  const sortDescending = ref(true);
  
  // filtering
  const wordFilter = ref<string | null>(null);
  const currentTab = ref('Live');
  
  const onFilter = (tab: string) => {
    currentTab.value = tab;
  };
  
  const tabs = computed(() => {
    const liveCount = props.drops.reduce(
      (carry, item) => (item.isPublished ? carry + 1 : carry),
      0,
    );
  
    const draftCount = props.drops.reduce(
      (carry, item) => (!item.isPublished ? carry + 1 : carry),
      0,
    );
  
    return [
      { label: 'Live', count: liveCount },
      { label: 'Draft', count: draftCount },
    ];
  });
  
  const filteredIndex = computed((): DropIndexItem[] => {
    const publishFiltered = props.drops.filter((item) => {
      if (currentTab.value === 'Live') return item.isPublished;
      if (currentTab.value === 'Draft') return !item.isPublished;
    });
  
    if (!wordFilter.value) return publishFiltered;
  
    return publishFiltered.filter((item) => {
      return item.title.toLowerCase().includes(wordFilter.value!.toLowerCase() || '');
    });
  });
  
  const displayIndex = computed(() => {
    const sorted = [...filteredIndex.value].sort((a, b) => {
      const dateA = new Date(a.releaseAt || 0);
      const dateB = new Date(b.releaseAt || 0);
  
      if (sortDescending.value) {
        return dateB.getTime() - dateA.getTime(); // Descending (newest first)
      } else {
        return dateA.getTime() - dateB.getTime(); // Ascending (oldest first)
      }
    });
  
    return sorted;
  });
  
  // display
  const isList = ref(false);
  
  const addDrop = () => {
    router.get(`/${shared.locale}/stream/${props.stream.id}/drop/create`);
  };
  </script>
  