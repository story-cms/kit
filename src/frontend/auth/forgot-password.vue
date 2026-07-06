<template>
  <PublicLayout>
    <template #logo>
      <img :src="config.logo" alt="Logo" class="h-auto w-[154px]" />
    </template>

    <div>
      <h2 class="mt-6 text-center text-3xl font-bold leading-9 text-black">
        Request Password Reset
      </h2>
      <p v-if="errors && errors.email" class="mt-2 text-center text-sm text-error">
        {{ errors.email }}
      </p>
      <p v-if="success" class="mt-2 text-center text-sm text-green-500">
        We have sent you an e-mail with instructions to reset your password. Please use
        the link within 24hrs to reset your password.
      </p>
    </div>
    <form v-if="!success" class="mt-8 space-y-6" @submit.prevent="submit">
      <div class="-space-y-px rounded-xl shadow-sm">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
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
        <button
          type="submit"
          class="auth-button"
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
import type { UiConfig } from '../../types';

defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
  result: {
    type: Object,
    default: () => ({}),
  },
  config: {
    type: Object as PropType<UiConfig>,
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
