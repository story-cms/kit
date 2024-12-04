<template>
  <div>
    <h3 class="mt-6">Error state</h3>
    <code>
      <pre class="my-4 text-emerald-500">{{ pretty }}</pre>
    </code>
    <div v-if="!isInspectOnly">
      <HstJson v-model="formErrors" title="Desired state" />
      <div class="my-4">
        <HstButton color="primary" class="htw-p-2 bg-emerald-500" @click="setError">
          Set Error
        </HstButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSharedStore } from '../../store';
import { computed, toRef } from 'vue';

const props = defineProps({
  errors: {
    type: Object,
    required: false,
    default: () => ({
      'bundle.name': ['required validation failed'],
      'bundle.spreads.0.title': ['required validation failed'],
    }),
  },
  isInspectOnly: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const formErrors = toRef(props, 'errors');

const store = useSharedStore();

const setError = () => {
  store.errors = formErrors.value;
};

const pretty = computed(() => JSON.stringify(store.errors, null, 2));
</script>
