<template>
  <Story title="Gallery Grid" group="shared">
    <Variant title="Without Images">
      <GalleryGrid :is-list="false" :items="items">
        <GalleryItem v-for="item in items" :key="item.id" v-bind="item" :is-list="false">
          <div>
            <p>
              I hope they never find out that lightning has a lot of vitamins in it,
              because do you hide from it or not?
            </p>
          </div>
          <div class="flex gap-x-2">
            <span
              class="flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium leading-4"
              >Ahead: 1 day</span
            >
            <span
              class="flex size-[30px] items-center justify-center rounded-full bg-gray-100 p-2 text-xs font-medium leading-4 text-gray-800"
              >42</span
            >
          </div>
        </GalleryItem>
      </GalleryGrid>
    </Variant>

    <Variant title="With Images and Bookmark">
      <GalleryGrid :is-list="false" :items="itemsWithImages">
        <GalleryItem
          v-for="item in itemsWithImages"
          :key="item.id"
          v-bind="item"
          :is-list="false"
          :has-bookmark="true"
        >
          <p class="mt-2 text-sm font-medium leading-5 text-gray-500">Score: 42</p>
        </GalleryItem>
      </GalleryGrid>
    </Variant>

    <Variant title="List view with bookmark">
      <GalleryGrid :is-list="true" :items="itemsWithImages">
        <GalleryItem
          v-for="item in itemsWithImages"
          :key="item.id"
          v-bind="item"
          :is-list="true"
          :has-bookmark="true"
        >
        </GalleryItem>
      </GalleryGrid>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import GalleryGrid from './gallery-grid.vue';
import GalleryItem from './gallery-item.vue';

const itemsWithImages: any[] = [
  {
    id: 1,
    title: 'Item 1',
    subTitle: 'Whose cruel idea was it for the word "lisp" to have an "s" in it?',
    link: '/en/campaign/1',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756122407/christ-chaos-header_yqrufy_lzmfjt.jpg',
  },
  {
    id: 2,
    title: 'Item 2',
    subTitle: 'How come abbreviated is such a long word?',
    link: '/en/campaign/2',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756122183/aatrg9bikextwwun4vb2_kblpui.svg',
  },
  {
    id: 3,
    title: 'Item 3',
    link: '/en/campaign/3',
    subTitle: 'Do fish get cramps after eating?',
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  },
  {
    id: 4,
    title: 'Item 4',
    link: '/en/campaign/4',
    subTitle: "I got food poisoning today. I don't know when I'll use it.",
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  },
  {
    id: 5,
    title: 'Item 5',
    link: '/en/campaign/1',
    subTitle: "I'm writing a book. I've got the page numbers done.",
    coverImage:
      'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  },
];

const items = [
  {
    id: 1,
    title: 'Item 1',
    link: 'https://res.cloudinary.com/journeys/image/upload/v1756122407/christ-chaos-header_yqrufy_lzmfjt.jpg',
  },
  {
    id: 2,
    title: 'Item 2',
    link: 'https://res.cloudinary.com/journeys/image/upload/v1756122183/aatrg9bikextwwun4vb2_kblpui.svg',
  },
  {
    id: 3,
    title: 'Item 3',
    link: 'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  },
];
</script>

<docs lang="md"></docs>
