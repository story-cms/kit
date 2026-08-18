<template>
  <div class="space-y-6 pt-[30px]">
    <h1>Quick actions</h1>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ActionCard
        v-for="item in items"
        :key="item.label"
        :url="item.url"
        :icon="item.icon"
        :title="item.title"
        :description="item.description"
        :disabled="item.disabled"
        :label="item.label"
        @action="emit('action', item.url)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import ActionCard from './action-card.vue';

export interface ActionGridItem {
  url: string;
  icon: Component;
  title: string;
  description: string;
  label: string;
  disabled?: boolean;
}

defineProps<{
  items: ActionGridItem[];
}>();

const emit = defineEmits<{
  (e: 'action', url: string): void;
}>();
</script>
