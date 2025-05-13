<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Language Dashboard">
        <template #welcome-banner>
          <WelcomeBanner />
        </template>
      </ContentHeader>
    </template>
    <div>
      <h1>Language Dashboard Eles</h1>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import WelcomeBanner from './welcome-banner.vue';
import { useSharedStore } from '../store';
import { DashboardProps, SharedPageProps } from '../../types';

const props = defineProps<DashboardProps & SharedPageProps>();

const shared = useSharedStore();

shared.setFromProps(props);
</script>
