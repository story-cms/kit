<template>
  <AppLayout>
    <div class="container px-3 mx-auto mt-10">
      <div class="flow-root mt-8">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="uppercase bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="py-3 pl-4 pr-3 text-xs font-medium tracking-wide text-left text-gray-500 uppercase sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 text-xs font-medium tracking-wide text-left text-gray-500 uppercase"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 text-xs font-medium tracking-wide text-left text-gray-500 uppercase"
                    >
                      Languages
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 text-xs font-medium tracking-wide text-left text-gray-500 uppercase"
                    >
                      Last Activity
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="person in people" :key="person.email">
                    <UserRow :user="person" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container p-3 mx-auto">
      <h2 class="mb-4 text-2xl font-bold leading-7 text-black">Manage Users</h2>
      <div v-if="otherError" class="py-4 text-error">
        {{ otherError }}
      </div>
      <section v-if="formMode == 'hidden'">
        <ul class="md:w-1/3">
          <li
            v-for="user in users"
            :key="user.id"
            class="flex justify-between py-2 text-xl border-b border-gray-300"
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
              <icon name="trash" class="w-10 h-10" />
            </button>
          </li>
        </ul>
        <div class="my-8">
          <button type="button" class="w-32 btn btn-blue" @click="onAdd()">
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

          <div class="flex my-8 space-x-4">
            <!-- eslint-disable vue/no-v-html -->
            <button class="w-32 btn btn-blue" type="submit" v-html="submitLabel"></button>
            <button class="w-32 bg-white btn" type="button" @click.prevent="onCancel()">
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
import UserRow from './components/user-row.vue';
import { SharedPageProps, UsersProps, UserMeta, type User } from '../../types';
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

const submitLabel = computed(() => (formMode.value === 'update' ? 'Update' : 'Add'));

const people: User[] = [
  {
    id: 1,
    name: 'Lindsay Walton',
    initials: 'LW',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    isManager: false,
    isAdmin: false,
    language: 'en',
    lastActivity: '2021-01-01',
  },
  // TODO: Add more users with different roles and names
  {
    id: 2,
    name: 'John Doe',
    initials: 'JD',
    email: 'john.doe@example.com',
    role: 'Admin',
    isManager: false,
    isAdmin: false,
    language: 'en',
    lastActivity: 'Yesterday',
  },
  {
    id: 3,
    name: 'Jane Smith',
    initials: 'JS',
    email: 'jane.smith@example.com',
    role: 'Editor',
    isManager: false,
    isAdmin: false,
    language: 'es',
    lastActivity: 'Tuesday',
  },
  {
    id: 4,
    name: 'Alice Johnson',
    initials: 'AJ',
    email: 'alice.johnson@example.com',
    role: 'Member',
    isManager: false,
    isAdmin: false,
    language: 'es',
    lastActivity: 'Yesterday',
  },
  {
    id: 5,
    name: 'Bob Brown',
    initials: 'BB',
    email: 'bob.brown@example.com',
    role: 'Member',
    isManager: false,
    isAdmin: false,
    language: 'en',
    lastActivity: '7th April',
  },
  {
    id: 6,
    name: 'Charlie Davis',
    initials: 'CD',
    email: 'charlie.davis@example.com',
    role: 'Member',
    isManager: false,
    isAdmin: false,
    language: 'es',
    lastActivity: 'Monday',
  },
  {
    id: 7,
    name: 'Diana Evans',
    initials: 'DE',
    email: 'diana.evans@example.com',
    role: 'Member',
    isManager: false,
    isAdmin: false,
    language: '*',
    lastActivity: 'Friday',
  },
];
</script>
