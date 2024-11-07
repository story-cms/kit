<template>
  <PublicLayout>
    <template #logo>
      <img :src="meta.logo" alt="Logo" class="h-12 w-auto" />
    </template>
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Sign in to your account
    </h2>

    <p v-if="errors && errors.credentials" class="mt-2 text-center text-sm text-error">
      {{ errors.credentials }}
    </p>
    <form class="mt-8 space-y-6" @submit.prevent="submit">
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
            :class="{ 'border-red': form.errors.email }"
            placeholder="Email address"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[--secondary-color] focus:outline-none focus:ring-[--secondary-color] sm:text-sm"
            :class="{ 'border-red': form.errors.password }"
            placeholder="Password"
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="form.remember"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-[--primary-color] focus:ring-[--secondary-color]"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a
            href="/forgot-password"
            class="font-medium text-gray-600 hover:text-[--secondary-color]"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="relative flex w-full justify-center rounded-md border border-transparent bg-[--primary-color] px-4 py-2 text-sm font-medium text-white hover:bg-[--secondary-color] focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2"
        >
          Sign in
        </button>
      </div>
    </form>
  </PublicLayout>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Meta } from '../../interfaces';
import PublicLayout from '../shared/public-layout.vue';

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

const form = useForm({
  email: null,
  password: null,
  remember: false,
});

const submit = () => form.post('/login');
</script>
