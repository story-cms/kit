<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Streams">
        <template #actions>
          <div class="flex items-center justify-center gap-x-6">
            <Icon
              :name="iconName"
              class="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-black"
              @click.prevent="toggle"
            />
          </div>
        </template>
      </ContentHeader>
    </template>

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
  </AppLayout>
</template>

<script setup lang="ts">
import { SharedPageProps } from '../../types';
import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import Icon from '../shared/icon.vue';
import { StreamGalleryProps } from '../../types';
import StreamItem from './components/stream-item.vue';
import { computed, ref } from 'vue';

const props = defineProps<StreamGalleryProps & SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);

const isList = ref(false);

const toggle = () => {
  isList.value = !isList.value;
};

const iconName = computed(() => {
  return isList.value ? 'grid' : 'list';
});
</script>
