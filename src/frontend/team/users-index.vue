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
        <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="border-2 border-black/5 sm:rounded-lg">
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
                    <UserRow
                      :user="user"
                      @update="focus(user)"
                      @remove="deleteUser(user)"
                    />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <section
        :class="[
          'inset-0 z-30 bg-gray-600 bg-opacity-60',
          formMode == 'hidden' ? 'hidden' : 'fixed',
        ]"
      >
        <div class="mx-auto flex h-full max-w-lg flex-col items-center justify-center">
          <div
            class="relative w-full min-w-full rounded-lg bg-white px-20 pb-[75px] pt-[90px]"
          >
            <form class="relative" @submit.prevent="submit">
              <div class="flex justify-end">
                <button type="button" class="-mr-4 mb-6" @click.prevent="onCancel()">
                  <Icon name="close" class="text-gray-900" />
                </button>
              </div>
              <div v-if="otherError" class="py-4 text-error">
                {{ otherError }}
              </div>
              <div class="flex flex-col gap-y-[17px]">
                <div>
                  <label class="label" for="name">Name</label>
                  <div class="mt-[3px] pt-1">
                    <input
                      id="name"
                      v-model="form.name"
                      class="input-field placeholder:text-sm placeholder:font-normal placeholder:leading-5 placeholder:text-gray-400"
                      placeholder="John Doe"
                    />
                    <p v-if="form.errors.name" class="text-sm text-error">
                      {{ form.errors.name }}
                    </p>
                  </div>
                </div>

                <div>
                  <label class="label" for="email">Email</label>
                  <div class="mt-[3px] pt-1">
                    <input
                      id="email"
                      v-model="form.email"
                      class="input-field placeholder:text-sm placeholder:font-normal placeholder:leading-5 placeholder:text-gray-400"
                      placeholder="you@example.com"
                    />
                    <p v-if="form.errors.email" class="text-sm text-error">
                      {{ form.errors.email }}
                    </p>
                  </div>
                </div>

                <div v-if="focusId != shared.user.id">
                  <label class="label" for="role">Role</label>
                  <select id="role" v-model="form.role" class="input-field mt-[5px]">
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

                <div>
                  <label class="label" for="language">Language</label>
                  <select
                    id="language"
                    v-model="form.language"
                    class="input-field mt-[5px]"
                  >
                    <option value="*" :selected="form.language === '*'">
                      All Languages
                    </option>
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
              </div>
              <div class="mt-[78px] flex">
                <!-- eslint-disable vue/no-v-html -->
                <button
                  class="mx-auto rounded-full bg-blue-500 px-9 py-[9px] text-[14px] font-bold leading-5 text-white shadow"
                  type="submit"
                  v-html="submitLabel"
                ></button>
              </div>
            </form>
          </div>
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
import { ResponseStatus } from '../../types';
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
shared.setCurrentStoryName('');

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
  form.delete(`/${shared.locale}/user/${user.id}`, {
    onSuccess: () => {
      shared.addMessage(ResponseStatus.Confirmation, 'User deleted successfully');
    },
    onError: () => {
      shared.addMessage(ResponseStatus.Failure, 'Error... user not deleted');
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
    form.post(`/${shared.locale}/user`, {
      onSuccess: () => {
        focusId.value = 0;
        formMode.value = 'hidden';
        shared.addMessage(ResponseStatus.Confirmation, 'User created successfully');
      },
      onError: () => {
        console.log('error');
        shared.addMessage(ResponseStatus.Failure, 'Error... user not created');
      },
    });
    return;
  }

  // Update
  form.put(`/${shared.locale}/user/${focusId.value}`, {
    onSuccess: () => {
      focusId.value = 0;
      formMode.value = 'hidden';
      shared.addMessage(ResponseStatus.Confirmation, 'User updated successfully');
    },
    onError: () => {
      console.log('error');
      shared.addMessage(ResponseStatus.Failure, 'Error... user not updated');
    },
  });
};

const submitLabel = computed(() => (formMode.value === 'update' ? 'Update' : 'Add User'));
</script>

<style scoped>
.label {
  @apply text-base font-normal leading-7 text-black;
}
</style>
