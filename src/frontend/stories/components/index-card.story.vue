<template>
  <Story id="index-card" title="Index Card" group="stories">
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
        placeholder-image="https://res.cloudinary.com/journeys/image/upload/v1756403499/alabaster-co-rlb3upCBLck-unsplash_nfp13e.jpg"
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
        placeholder-image="https://picsum.photos/seed/1733288671859/500/500"
        chapter-name="Story"
      />
      <template #controls> </template>
    </Variant>
    <Variant title="List">
      <IndexCard
        :item="item"
        :is-list="isList"
        scope=""
        placeholder-image="https://picsum.photos/seed/1733288671859/500/500"
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
  imageUrl: 'https://picsum.photos/seed/1733288671859/500/500',
  title: 'Index Ready Item Title',
  tags: [],
};

const itemSquare = {
  number: 1,
  imageUrl: 'https://picsum.photos/seed/1733288727386/300/300',
  title: 'Square Image Title',
  tags: ['Live'],
};

const itemTall = {
  number: 1,
  imageUrl: 'https://picsum.photos/seed/1733288772523/300/600',
  title: 'Tall image',
  tags: ['Live', 'Draft'],
};

const itemWide = {
  number: 1,
  imageUrl: 'https://picsum.photos/seed/1733288805172/400/200',
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
