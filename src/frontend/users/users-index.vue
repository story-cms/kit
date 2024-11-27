<template>
  <AppLayout>
    <div class="container mx-auto p-3">
      <h2 class="mb-4 text-2xl font-bold leading-7 text-black">Manage Users</h2>
      <div v-if="otherError" class="py-4 text-error">
        {{ otherError }}
      </div>
      <section v-if="formMode == 'hidden'">
        <ul class="md:w-1/3">
          <li
            v-for="user in users"
            :key="user.id"
            class="flex justify-between border-b border-gray-300 py-2 text-xl"
          >
            <div class="cursor-pointer" @click="focus(user)">
              {{ user.name }} &lt;{{ user.email }}&gt;
            </div>
            <button
              v-if="user.id != shared.user.id"
              type="button"
              class="cursor-pointer"
              @click="deleteUser(user)"
            >
              <icon name="trash" class="h-10 w-10" />
            </button>
          </li>
        </ul>
        <div class="my-8">
          <button type="button" class="btn btn-blue w-32" @click="onAdd()">
            Add User
          </button>
        </div>
      </section>

      <section v-if="formMode != 'hidden'" class="md:w-1/3">
        <form @submit.prevent="submit">
          <div class="my-2">
            <label class="input-label" for="name">Name:</label>
            <div class="mt-[2px] pt-1">
              <input id="name" v-model="form.name" class="input-field" />
              <p v-if="form.errors.name" class="text-sm text-error">
                {{ form.errors.name[0] }}
              </p>
            </div>
          </div>

          <div class="my-2">
            <label class="input-label" for="email">Email:</label>
            <div class="mt-[2px] pt-1">
              <input id="email" v-model="form.email" class="input-field" />
              <p v-if="form.errors.email" class="text-sm text-error">
                {{ form.errors.email[0] }}
              </p>
            </div>
          </div>

          <div v-if="focusId != shared.user.id" class="my-2">
            <label class="input-label" for="role">Role:</label>
            <select id="role" v-model="form.role" class="input-field">
              <option
                v-for="role in roles"
                :key="role"
                :value="role"
                :selected="role == form.role"
              >
                {{ role }}
              </option>
            </select>
          </div>

          <div class="my-2">
            <label class="input-label" for="language">Language:</label>
            <select id="language" v-model="form.language" class="input-field">
              <option value="*" :selected="form.language === '*'">All Languages</option>
              <option
                v-for="lang in shared.languages"
                :key="lang.locale"
                :value="lang.locale"
                :selected="lang.locale == form.language"
              >
                {{ lang.language }}
              </option>
            </select>
            <p v-if="form.errors.language" class="text-sm text-error">
              {{ form.errors.language[0] }}
            </p>
          </div>

          <div class="my-8 flex space-x-4">
            <!-- eslint-disable vue/no-v-html -->
            <button
              class="btn btn-blue bg-slate-200 w-32"
              type="submit"
              v-html="submitLabel"
            ></button>
            <button class="btn w-32 bg-white" type="button" @click.prevent="onCancel()">
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AppLayout from '../shared/app-layout.vue';
import Icon from '../shared/icon.vue';
import { SharedPageProps, UsersProps, UserMeta } from '../../types';
import { useSharedStore } from '../store';

const emptyForm = {
  name: '',
  email: '',
  language: 'en',
  role: 'editor',
};

const props = defineProps<UsersProps & SharedPageProps>();

const shared = useSharedStore();
shared.setFromProps(props);

const focusId = ref(0);
const roles = ['admin', 'editor'];
const formMode = ref('hidden');
const form = useForm(emptyForm);

type userErrors = Partial<
  Record<'name' | 'email' | 'language' | 'role' | 'other', string>
>;
const otherError = computed((): string => {
  const all = form.errors as userErrors;
  return all.other || '';
});

const focus = (user: UserMeta) => {
  focusId.value = user.id;
  form.name = user.name;
  form.email = user.email;
  form.language = user.language;
  form.role = user.role;
  formMode.value = 'update';
};

const deleteUser = (user: UserMeta) => {
  resetForm();
  formMode.value = 'hidden';
  form.delete(`/user/${user.id}`, {
    onError: () => {
      console.log('error');
    },
  });
};

const onCancel = () => {
  resetForm();
  formMode.value = 'hidden';
};

const onAdd = () => {
  resetForm();
  formMode.value = 'add';
};

const resetForm = () => {
  form.name = emptyForm.name;
  form.email = emptyForm.email;
  form.role = emptyForm.role;
  form.language = emptyForm.language;
  focusId.value = 0;
};

const submit = () => {
  if (formMode.value == 'add') {
    form.post('/user', {
      onSuccess: () => {
        focusId.value = 0;
        formMode.value = 'hidden';
      },
      onError: () => {
        console.log('error');
      },
    });
    return;
  }

  // Update
  form.put(`/user/${focusId.value}`, {
    onSuccess: () => {
      focusId.value = 0;
      formMode.value = 'hidden';
    },
    onError: () => {
      console.log('error');
    },
  });
};

const submitLabel = computed(() => (formMode.value == 'update' ? 'Update' : 'Add'));
</script>
