<template>
  <PublicLayout>
    <template #logo>
      <img :src="meta.logo" alt="Logo" class="h-auto w-[154px]" />
    </template>

    <div>
      <h2 class="mb-16 mt-6 text-center text-3xl font-bold leading-9 text-black">
        Create your account
      </h2>

      <div v-if="errors">
        <p v-if="errors.password" class="mt-2 text-center text-sm text-error">
          {{ errors.password }}
        </p>

        <p v-if="errors.token" class="mt-2 text-center text-sm text-error">
          {{ errors.token }}
        </p>
      </div>
    </div>
    <form class="space-y-11" @submit.prevent="submit">
      <div class="flex flex-col gap-y-6">
        <div>
          <label for="email" class="auth-input-label">Email Address</label>
          <div class="mt-1">
            <span
              class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm font-normal leading-5 text-gray-300 placeholder-gray-300"
            >
              {{ form.email }}
            </span>
          </div>
        </div>
        <div>
          <label for="password" class="auth-input-label">Password</label>
          <div class="mt-1">
            <input
              id="password"
              v-model="form.password"
              type="password"
              name="password"
              autocomplete="password"
              required
              class="auth-input-field"
              :class="{ 'border-red-500': errors.password || errors.confirmPassword }"
            />
          </div>
        </div>
        <div>
          <label for="confirm-password" class="auth-input-label">Confirm Password</label>
          <div class="mt-1">
            <input
              id="confirm-password"
              v-model="form.confirmPassword"
              type="password"
              name="confirm-password"
              autocomplete="confirm-password"
              required
              class="auth-input-field"
              :class="{ 'border-red-500': errors.password || errors.confirmPassword }"
            />
          </div>
        </div>
      </div>

      <div>
        <button type="submit" class="auth-button">Set your password</button>
      </div>
    </form>
  </PublicLayout>
</template>

<script setup lang="ts">
import { PropType, onMounted } from 'vue';
import { useForm } from '@inertiajs/vue3';
import PublicLayout from '../shared/public-layout.vue';
import { CmsMeta } from '../../types';

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  meta: {
    type: Object as PropType<CmsMeta>,
    required: true,
  },
});

const form = useForm({
  email: '',
  password: '',
  confirmPassword: '',
});

const submit = async () => {
  const token = window.location.href.split('create-account/')[1];
  form.post(`/create-account/${token}`);
};

onMounted(() => {
  form.email = props.email as string;
});
</script>
