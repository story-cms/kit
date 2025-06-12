<template>
  <PublicLayout>
    <template #logo>
      <img :src="meta.logo" alt="Logo" class="h-auto w-[154px]" />
    </template>

    <div>
      <h2 class="mt-6 mb-16 text-3xl font-bold leading-9 text-center text-black">
        Create your account
      </h2>
      <p v-if="success" class="mt-2 text-sm text-center text-green-500">
        Account created successfully
      </p>
      <a href="/login"
        ><button
          v-if="success"
          type="submit"
          class="group relative mx-auto mt-4 flex justify-center rounded-full border border-transparent bg-[--primary-color] px-4 py-2 text-sm font-medium text-white hover:bg-[--secondary-color]"
        >
          Login
        </button></a
      >

      <div v-if="errors">
        <p v-if="errors.password" class="mt-2 text-sm text-center text-error">
          {{ errors.password }}
        </p>

        <p v-if="errors.token" class="mt-2 text-sm text-center text-error">
          {{ errors.token }}
        </p>
      </div>
    </div>
    <form v-if="!success" class="space-y-11" @submit.prevent="submit">
      <div class="flex flex-col gap-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900"
            >Email address</label
          >
          <div class="mt-1">
            <span
              class="relative block w-full px-3 py-2 text-gray-300 placeholder-gray-300 border border-gray-300 rounded-md appearance-none sm:text-sm"
            >
              {{ form.email }}
            </span>
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-900"
            >Password</label
          >
          <div class="mt-1">
            <input
              id="password"
              v-model="form.password"
              type="password"
              name="password"
              autocomplete="password"
              required
              class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[--secondary-color] focus:outline-none focus:ring-[--secondary-color] sm:text-sm"
              :class="{ 'border-red-500': errors.password || errors.confirmPassword }"
            />
          </div>
        </div>
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-900"
            >Confirm Password</label
          >
          <div class="mt-1">
            <input
              id="confirm-password"
              v-model="form.confirmPassword"
              type="password"
              name="confirm-password"
              autocomplete="confirm-password"
              required
              class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[--secondary-color] focus:outline-none focus:ring-[--secondary-color] sm:text-sm"
              :class="{ 'border-red-500': errors.password || errors.confirmPassword }"
            />
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative mx-auto flex justify-center rounded-full border border-transparent bg-[--primary-color] px-4 py-2 text-sm font-medium text-white hover:bg-[--secondary-color]"
        >
          Set your password
        </button>
      </div>
    </form>
  </PublicLayout>
</template>

<script setup lang="ts">
import { PropType, ref, onMounted } from 'vue';
import { useForm } from '@inertiajs/vue3';
import PublicLayout from '../shared/public-layout.vue';
import { Meta } from '../../types';

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
    type: Object as PropType<Meta>,
    required: true,
  },
});

const success = ref(false);
const form = useForm({
  email: '',
  password: '',
  confirmPassword: '',
});

const submit = async () => {
  const token = window.location.href.split('create-account/')[1];
  form.post(`/create-account/${token}`, {
    onSuccess() {
      success.value = true;
    },
  });
};

onMounted(() => {
  form.email = props.email as string;
});
</script>
