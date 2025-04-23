<template>
  <AppLayout>
    <div class="container relative px-3 mx-auto">
      <h2>Micro Copy Status</h2>
      <section class="flex flex-col space-y-6">
        <div>
          <h3>{{ shared.uiTodoCount }}</h3>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../shared/app-layout.vue';
import { useSharedStore } from '../store';
import type {  SharedPageProps } from '../../types';

const props = defineProps<SharedPageProps>();

const shared = useSharedStore();
shared.setFromProps(props);
</script>
