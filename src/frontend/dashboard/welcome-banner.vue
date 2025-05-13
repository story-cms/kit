<template>
  <section>
    <Link href="/">
      <img :src="shared.meta.logo" alt="Logo" class="h-12 w-auto" />
    </Link>
  </section>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { useSharedStore } from '../store';

const shared = useSharedStore();
</script>
