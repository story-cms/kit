<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white text-sm font-medium leading-4 text-studio-forest hover:bg-gray-50"
    :class="[
      dashed ? 'border-dashed' : '',
      fullWidth ? 'w-full px-3 py-3' : 'w-auto max-w-fit px-4 py-2',
    ]"
    @click.prevent="$emit('click')"
  >
    <div class="inline-flex items-center justify-center gap-2">
      <slot />
    </div>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    dashed?: boolean;
    fullWidth?: boolean;
  }>(),
  {
    dashed: true,
    fullWidth: true,
  },
);

defineEmits<{
  click: [];
}>();
</script>
