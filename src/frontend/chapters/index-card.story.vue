<template>
  <Story id="index-card" title="Index Card" group="chapter">
    <Variant title="Without Image">
      <IndexCard
        :item="itemNoImage"
        :is-list="notList"
        scope="Draft"
        chapter-name="Story"
      />
    </Variant>
    <Variant title="With Image">
      <IndexCard :item="item" :is-list="notList" scope="Draft" chapter-name="Story" />
    </Variant>
    <Variant title="Placeholder Image">
      <IndexCard
        :item="itemNoImage"
        :is-list="notList"
        scope="Draft"
        placeholder-image="https://res.cloudinary.com/onesheep/image/upload/v1685084993/christ-chaos-header_yqrufy.jpg"
        chapter-name="Story"
      />
    </Variant>
    <Variant title="Square Image">
      <IndexCard
        :item="itemSquare"
        :is-list="notList"
        scope="Live"
        chapter-name="Story"
      />
    </Variant>
    <Variant title="Grid">
      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <IndexCard
          :item="itemWide"
          :is-list="notList"
          scope="Draft"
          chapter-name="Story"
        />

        <IndexCard
          :item="itemSquare"
          :is-list="notList"
          scope="Draft"
          chapter-name="Story"
        />
        <IndexCard
          :item="itemTall"
          :is-list="notList"
          scope="Draft"
          chapter-name="Story"
        />
      </div>
    </Variant>
    <Variant title="Tall Image">
      <IndexCard :item="itemTall" :is-list="notList" scope="Live" chapter-name="Story" />
    </Variant>
    <Variant title="Wide Image">
      <IndexCard :item="itemWide" :is-list="notList" scope="Live" chapter-name="Story" />
    </Variant>
    <Variant title="Scope">
      <IndexCard
        :item="item"
        :is-list="notList"
        scope="Draft"
        placeholder-image="https://res.cloudinary.com/onesheep/image/upload/v1684754051/Screenshot_2023-05-22_at_13.12.03_pnamdt.png"
        chapter-name="Story"
      />
      <template #controls> </template>
    </Variant>
    <Variant title="List">
      <IndexCard
        :item="item"
        :is-list="isList"
        scope=""
        placeholder-image="https://res.cloudinary.com/onesheep/image/upload/v1684754051/Screenshot_2023-05-22_at_13.12.03_pnamdt.png"
        chapter-name="Story"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import IndexCard from './index-card.vue';

const isList = true;
const notList = false;
const item = {
  number: 1,
  imageUrl:
    'https://res.cloudinary.com/onesheep/image/upload/v1684754051/Screenshot_2023-05-22_at_13.12.03_pnamdt.png',
  title: 'Index Ready Item Title',
  tags: [],
};

const itemSquare = {
  number: 1,
  imageUrl:
    'https://res.cloudinary.com/theword121/image/upload/v1678106836/episodes/x3i0acaboi9uaj7zmqmz.svg',
  title: 'Square Image Title',
  tags: ['Live'],
};

const itemTall = {
  number: 1,
  imageUrl:
    'https://res.cloudinary.com/theword121/image/upload/v1684768272/episodes/way4y06pk1smaxxg8u6p.jpg',
  title: 'Tall image',
  tags: ['Live', 'Draft'],
};

const itemWide = {
  number: 1,
  imageUrl:
    'https://res.cloudinary.com/theword121/image/upload/v1687325215/episodes/excr8br4oeeblysd9upg.png',
  title: 'Wide Image',
  tags: ['Live'],
};

const itemNoImage = {
  number: 1,
  imageUrl: '',
  title: 'Index Ready Item Title',
  tags: [],
};
</script>
