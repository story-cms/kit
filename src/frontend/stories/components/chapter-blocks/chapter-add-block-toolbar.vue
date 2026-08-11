<template>
  <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
    <button
      type="button"
      class="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-studio-forest px-3 py-[18px] text-sm font-medium leading-4 text-studio-forest shadow-sm hover:bg-studio-lime"
      @click.prevent="$emit('addTitle')"
    >
      <div class="inline-flex items-center justify-center gap-2">
        <Plus class="size-5" aria-hidden="true" />
        <span>Add Title Block</span>
      </div>
    </button>
    <button
      type="button"
      class="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-studio-forest px-3 py-[18px] text-sm font-medium leading-4 text-studio-forest shadow-sm hover:bg-studio-lime"
      @click.prevent="$emit('addScripture')"
    >
      <div class="inline-flex items-center justify-center gap-2">
        <Plus class="size-5" aria-hidden="true" />
        <span>Add Scripture Block</span>
      </div>
    </button>
    <button
      type="button"
      class="inline-flex w-full items-center justify-center rounded-xl border border-dashed border-studio-forest px-3 py-[18px] text-sm font-medium leading-4 text-studio-forest shadow-sm hover:bg-studio-lime"
      @click.prevent="$emit('addContent')"
    >
      <div class="inline-flex items-center justify-center gap-2">
        <Plus class="size-5" aria-hidden="true" />
        <span>Add Content Block</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@lucide/vue';

defineEmits<{
  addTitle: [];
  addScripture: [];
  addContent: [];
}>();
</script>
