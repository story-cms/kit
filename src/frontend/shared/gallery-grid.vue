<template>
  <div
    :class="[
      'grid gap-4',
      {
        'grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))]': !isList && items.length > 3,
      },
      {
        'grid-cols-[repeat(auto-fit,_minmax(260px,_260px))]':
          !isList && items.length <= 3,
      },
      {
        'grid-cols-1': isList,
      },
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isList: boolean;
  items: any[];
}>();
</script>
