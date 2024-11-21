<template>
  <AppLayout>
    <h1>Dashboard for {{ props.storyName }}</h1>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../shared/app-layout.vue';
import { SharedPageProps, DashboardProps } from '../../interfaces';
import { useSharedStore } from '../store';

const props = defineProps<DashboardProps & SharedPageProps>();

useSharedStore().setFromProps(props);
</script>
