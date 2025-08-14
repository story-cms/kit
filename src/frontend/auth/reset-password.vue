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
        ><button v-if="success" type="submit" class="auth-button">Login</button></a
      >

      <div v-if="errors">
        <p v-if="errors.password" class="mt-2 text-center text-sm text-error">
          {{ errors.password }}
        </p>

        <p v-if="errors.token" class="mt-2 text-center text-sm text-error">
          {{ errors.token }}
        </p>
      </div>
    </div>
    <form v-if="!success" class="mt-8 space-y-11" @submit.prevent="submit">
      <div class="flex flex-col gap-y-6">
        <div>
          <label for="email-address" class="auth-input-label">Email Address</label>
          <div class="mt-1">
            <input
              id="email-address"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="auth-input-field"
              placeholder="Email address"
            />
          </div>
        </div>
        <div>
          <label for="password" class="auth-input-label">New Password</label>
          <div class="mt-1">
            <input
              id="new-password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="auth-input-field"
              placeholder="New Password"
            />
          </div>
        </div>
        <div>
          <label for="password" class="auth-input-label">Confirm New Password</label>
          <div class="mt-1">
            <input
              id="confirm-new-password"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="confirm-new-password"
              required
              class="auth-input-field"
              placeholder="Confirm New Password"
            />
          </div>
        </div>
      </div>

      <div>
        <button type="submit" class="auth-button">Reset Password</button>
      </div>
    </form>
  </PublicLayout>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import PublicLayout from '../shared/public-layout.vue';
import { CmsMeta } from '../../types';

defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },

  meta: {
    type: Object as PropType<CmsMeta>,
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
