<template>
  <PublicLayout>
    <template #logo>
      <img :src="meta.logo" alt="Logo" class="h-auto w-[154px]" />
    </template>
    <h2 class="mb-16 mt-6 text-center text-3xl font-bold leading-9 text-black">
      Sign in to your account
    </h2>

    <p v-if="errors && errors.credentials" class="mt-2 text-center text-sm text-error">
      {{ errors.credentials }}
    </p>
    <p v-if="message" class="mt-2 text-center text-sm">
      {{ message }}
    </p>
    <form class="space-y-6" @submit.prevent="submit">
      <div class="flex flex-col gap-y-6">
        <div>
          <label for="email-address" class="auth-input-label">Email address</label>
          <div class="mt-1">
            <input
              id="email-address"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="auth-input-field"
              :class="{ 'border-red': form.errors.email }"
              placeholder="Email address"
            />
          </div>
        </div>
        <div>
          <label for="password" class="auth-input-label">Password</label>
          <div class="mt-1">
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="auth-input-field"
              :class="{ 'border-red': form.errors.password }"
              placeholder="Password"
            />
          </div>
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
        <button type="submit" class="auth-button">Sign in</button>
      </div>
    </form>
  </PublicLayout>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Meta } from '../../types';
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

const msg = new URLSearchParams(window.location.search).get('message');

const message = computed(() => {
  if (msg === 'registration_success') {
    return 'Account created successfully. Please login.';
  }
  if (msg === 'password_reset_success') {
    return 'Password reset successful. Please login.';
  }
  if (msg === 'session_expired') {
    return 'Your session has expired. Please login to continue.';
  }
  return '';
});

const submit = () => form.post('/login');
</script>
