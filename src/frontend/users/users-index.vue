<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="User Management">
        <template #actions>
          <div class="flex items-center gap-x-6">
            <button
              type="button"
              class="rounded-full border border-gray-300 bg-white p-2 shadow hover:bg-blue-100"
              @click="onAdd()"
            >
              <Icon name="plus" class="text-gray-900" />
            </button>
          </div>
        </template>
      </ContentHeader>
    </template>
    <div>
      <section class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50 uppercase">
                  <tr>
                    <th
                      scope="col"
                      class="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Languages
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Last Activity
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="user in users" :key="user.id">
                    <UserRow :user="user" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <section class="fixed inset-0 z-30 bg-gray-600 bg-opacity-60">
        <div class="mx-auto flex h-full max-w-lg flex-col items-center justify-center">
          <form
            class="relative w-full min-w-full rounded-lg bg-white px-20 pb-[75px] pt-[90px]"
            @submit.prevent="submit"
          >
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
                class="btn btn-blue w-32"
                type="submit"
                v-html="submitLabel"
              ></button>
              <button class="btn w-32 bg-white" type="button" @click.prevent="onCancel()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import Icon from '../shared/icon.vue';
import UserRow from './components/user-row.vue';
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

const submitLabel = computed(() => (formMode.value === 'update' ? 'Update' : 'Add'));
</script>
