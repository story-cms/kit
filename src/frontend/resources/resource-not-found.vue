<template>
  <AppLayout subtitle="Resource not found">

    <section class="mt-3 px-3">
      <div class="mx-auto max-w-lg py-16 text-center">
        <h3 class="mb-2 text-lg font-medium text-gray-900">Resource not found</h3>
        <p class="mb-6 text-sm text-gray-500">
          This resource is not available. Browse the library to find resources for this
          language.
        </p>
        <StudioButton
          label="Back to Resource Library"
          variant="secondary"
          @click="goToLibrary"
        />
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { ResourceNotFoundProps } from '../../types';
import { useSharedStore } from '../store';
import AppLayout from '../shared/app-layout.vue';
import StudioButton from '../shared/studio-button.vue';

const props = defineProps<ResourceNotFoundProps>();
const shared = useSharedStore();
shared.setFromProps(props);

const goToLibrary = () => {
  router.visit(`/${shared.locale}/resource`);
};
</script>
