<template>
  <AppLayout title="Streams" subtitle="Manage Streams">
    <template #controls>
      <div class="flex items-center justify-end">
        <ListSwitcher :is-list="isList" @toggle="isList = !isList" />
      </div>
    </template>
    <template #main>
      <section>
        <div
          class="my-8 flex gap-x-[26px]"
          :class="isList ? 'flex-col gap-y-6' : 'flex-wrap gap-y-[98px]'"
        >
          <div
            v-for="stream in streams"
            :key="stream.id"
            :class="isList ? 'w-full' : 'max-w-64'"
          >
            <StreamItem :stream="stream" :is-list="isList" />
          </div>
        </div>
      </section>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { SharedPageProps } from '../../types';
import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import ListSwitcher from '../shared/list-switcher.vue';
import { StreamGalleryProps } from '../../types';
import StreamItem from './components/stream-item.vue';
import { ref } from 'vue';

const props = defineProps<StreamGalleryProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);

const isList = ref(false);
</script>
