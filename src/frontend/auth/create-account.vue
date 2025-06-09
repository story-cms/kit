<template>
  <PublicLayout>
    <template #logo>
      <img :src="meta.logo" alt="Logo" class="h-12 w-auto" />
    </template>

    <div>
      <h2 class="mt-6 text-center font-bold leading-9 text-gray-900">
        Create your account
      </h2>
      <p v-if="success" class="mt-2 text-center text-sm text-green-500">
        Account created successfully
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
      <div class="flex flex-col gap-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900"
            >Email address</label
          >
          <div class="mt-1">
            <input
              id="email"
              type="email"
              name="email"
              autocomplete="email"
              required
              readonly
              class="block w-full rounded-md bg-white px-3 py-1.5 text-sm font-medium leading-5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400"
            />
          </div>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900"
            >Password</label
          >
          <div class="mt-1">
            <input
              id="email"
              type="email"
              name="email"
              autocomplete="email"
              required=""
              class="block w-full rounded-md bg-white px-3 py-1.5 text-sm font-medium leading-5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            />
          </div>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900"
            >Confirm Password</label
          >
          <div class="mt-1">
            <input
              id="email"
              type="email"
              name="email"
              autocomplete="email"
              required=""
              class="block w-full rounded-md bg-white px-3 py-1.5 text-sm font-medium leading-5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            />
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative mx-auto flex justify-center rounded-full border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-gray-700/50 focus:ring-offset-2"
        >
          Reset Password
        </button>
      </div>
    </form>
  </PublicLayout>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

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
</script>
