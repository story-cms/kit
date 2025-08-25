<template>
    <div
      class="overflow-hidden rounded-lg bg-white shadow flex h-full"
      :class="isList ? 'flex-row items-center' : 'flex-col'"
    >
      <img
        :src="imgUrl"
        :alt="drop.title"
        class="object-cover"
        :class="isList ? 'size-[60px]' : 'size-64'"
      />
      <div
        class="flex grow"
        :class="isList ? 'flex-row px-6' : 'flex-col justify-end  space-y-2 px-3 py-4'"
      >
        <div
          class="flex"
          :class="isList ? 'flex-row justify-between w-full space-x-4' : 'flex-col'"
        >
          <p class="text-base leading-6 font-bold text-gray-800">
            <span>{{ drop.title }}</span>
          </p>
          <p
            v-if="formattedReleaseAt"
            class="rounded-lg bg-gray-100 px-2 py-1 text-xs leading-4 font-medium text-gray-800 max-w-max"
          >
            {{ formattedReleaseAt }}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { DropIndexItem } from '../../../types';
  import { computed } from 'vue';
  
  const props = defineProps<{
    drop: DropIndexItem;
    isList: boolean;
    placeholderImage: string;
  }>();
  
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  const formattedReleaseAt = computed(() => {
    if (!props.drop.releaseAt) return '';
    const date = new Date(props.drop.releaseAt);
    const day = getOrdinal(date.getDate());
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  });
  
  const imgUrl = computed(() => props.drop.coverImage || props.placeholderImage);
  </script>
  