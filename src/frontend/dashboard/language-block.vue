<template>
  <div class="grid grid-cols-2 bg-white gap-x-9">
    <Ring
      v-for="item in stats"
      :key="item.name"
      :done="item.done"
      :draft="item.draft"
      :total="item.total"
      :name="item.name"
    />
  </div>
</template>
<script setup lang="ts">
import Ring from './ring.vue';
defineProps<{
  stats: {
    name: string;
    done: number;
    draft: number;
    total: number;
  }[];
}>();
</script>
