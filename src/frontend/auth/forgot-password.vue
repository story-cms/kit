<template>
  <PublicLayout>
    <template #logo>
      <img :src="meta.logo" alt="Logo" class="h-12 w-auto" />
    </template>

    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Request Password Reset
      </h2>
      <p v-if="errors && errors.email" class="mt-2 text-center text-sm text-error">
        {{ errors.email[0] }}
      </p>
      <p v-if="success" class="mt-2 text-center text-sm text-green-500">
        We have sent you an e-mail with instructions to reset your password. Please use
        the link within 24hrs to reset your password.
      </p>
    </div>
    <form v-if="!success" class="mt-8 space-y-6" @submit.prevent="submit">
      <div class="-space-y-px rounded-md shadow-sm">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input
            id="email-address"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[--secondary-color] focus:outline-none focus:ring-[--secondary-color] sm:text-sm"
            placeholder="Email address"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative flex w-full justify-center rounded-md border border-transparent bg-[--primary-color] px-4 py-2 text-sm font-medium text-white hover:bg-[--secondary-color] focus:outline-none focus:ring-2 focus:ring-[--secondary-color] focus:ring-offset-2"
          :class="{ 'cursor-wait opacity-50': form.processing }"
          :disabled="form.processing"
        >
          Send Reset Link
        </button>
      </div>
    </form>
  </PublicLayout>
</template>

<script setup lang="ts">
import PublicLayout from '../shared/public-layout.vue';
import { useForm } from '@inertiajs/vue3';
import { ref, PropType } from 'vue';
import { Meta } from '../../interfaces';
// 'errors', 'result', 'meta']
defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
  result: {
    type: Object,
    default: () => ({}),
  },
  meta: {
    type: Object as PropType<Meta>,
    required: true,
  },
});

const success = ref(false);
const form = useForm({
  email: null,
});

const submit = () =>
  form.post('/forgot-password', {
    onSuccess() {
      success.value = true;
    },
  });
</script>
