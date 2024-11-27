<template>
  <PublicLayout>
    <template #logo>
      <img :src="meta.logo" alt="Logo" class="h-12 w-auto" />
    </template>

    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Reset Password
      </h2>
      <p v-if="success" class="mt-2 text-center text-sm text-green-500">
        Password Reset Successful
      </p>
      <a href="/login"
        ><button
          v-if="success"
          type="submit"
          class="group relative mt-4 flex w-full justify-center rounded-md border border-transparent bg-gray-700/60 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-gray-700/50 focus:ring-offset-2"
        >
          Login
        </button></a
      >

      <div v-if="errors">
        <p v-if="errors.password" class="mt-2 text-center text-sm text-error">
          {{ errors.password[0] }}
        </p>

        <p v-if="errors.token" class="mt-2 text-center text-sm text-error">
          {{ errors.token }}
        </p>
      </div>
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
            class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-gray-700/50 focus:outline-none focus:ring-gray-700/50 sm:text-sm"
            placeholder="Email address"
          />
        </div>
        <div>
          <label for="password" class="sr-only">New Password</label>
          <input
            id="new-password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            class="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-gray-700/50 focus:outline-none focus:ring-gray-700/50 sm:text-sm"
            placeholder="New Password"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Confirm New Password</label>
          <input
            id="confirm-new-password"
            v-model="form.confirmPassword"
            name="confirmPassword"
            type="password"
            autocomplete="confirm-new-password"
            required
            class="focus:ring-gray-700-500 focus:border-gray-700-500 relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none sm:text-sm"
            placeholder="Confirm New Password"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative flex w-full justify-center rounded-md border border-transparent bg-[--primary-color] px-4 py-2 text-sm font-medium text-white hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-gray-700/50 focus:ring-offset-2"
        >
          Reset Password
        </button>
      </div>
    </form>
  </PublicLayout>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import PublicLayout from '../shared/public-layout.vue';
import { Meta } from '../../types';

defineProps({
  errors: {
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
  password: null,
  confirmPassword: null,
});

function submit() {
  const token = window.location.href.split('reset-password/')[1];
  form.post(`/reset-password/${token}`, {
    onSuccess() {
      success.value = true;
    },
  });
}
</script>
