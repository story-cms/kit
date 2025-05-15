<template>
  <section
    class="flex w-full flex-col items-center justify-center gap-y-7 bg-white pb-6 pt-5 shadow"
  >
    <Link href="/">
      <img :src="shared.meta.logo" alt="Logo" class="h-[100px] w-auto" />
    </Link>
    <div class="flex flex-col items-center justify-center gap-y-[14px] text-gray-800">
      <h1 class="text-4xl font-semibold leading-10">Hello {{ shared.user.name }}</h1>
      <p class="text-2xl font-semibold leading-8">Welcome to {{ shared.meta.name }}</p>
    </div>
    <div class="flex gap-x-4 pb-7">
      <Link
        href="/dashboard/new-page"
        class="flex items-center gap-x-2 rounded-full bg-blue-50 px-3 py-[9px] text-sm font-bold leading-4 text-blue-700 shadow hover:bg-blue-100"
      >
        <Icon name="document-add" />
        New Page
      </Link>
      <Link
        href="/dashboard/new-page"
        class="flex items-center gap-x-2 rounded-full bg-blue-50 px-3 py-[9px] text-sm font-bold leading-4 text-blue-700 shadow hover:bg-blue-100"
      >
        <Icon name="user-add" />
        New User
      </Link>
      <Link
        href="/dashboard/new-page"
        class="flex items-center gap-x-2 rounded-full bg-blue-50 px-3 py-[9px] text-sm font-bold leading-4 text-blue-700 shadow hover:bg-blue-100"
      >
        <Icon name="question-mark-circle" />
        Get Support
      </Link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { useSharedStore } from '../store';
import Icon from '../shared/icon.vue';

const shared = useSharedStore();
</script>
