<template>
  <AppLayout title="Team" subtitle="User Management">
    <template #actions>
      <div class="flex items-center gap-x-6">
        <StudioButton label="Add user" variant="secondary" @click="onAdd">
          <Plus class="size-4" aria-hidden="true" />
        </StudioButton>
      </div>
    </template>
    <template #main>
      <div>
        <section>
          <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table class="w-full min-w-[720px] table-auto">
              <thead class="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th
                    class="max-w-[400px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Name
                  </th>
                  <th
                    class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Role
                  </th>
                  <th
                    class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Languages
                  </th>
                  <th
                    class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Last Activity
                  </th>
                  <th
                    class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <UserRow
                  v-for="user in users"
                  :key="user.id"
                  :user="user"
                  @update="focus(user)"
                  @remove="deleteUser(user)"
                />
              </tbody>
            </table>
          </div>
        </section>
        <UserFormModal
          :open="formMode !== 'hidden'"
          :form="form"
          :form-mode="formMode === 'update' ? 'update' : 'add'"
          :focus-id="focusId"
          :current-user-id="shared.user.id"
          :roles="roles"
          :sorted-languages="sortedLanguages"
          @submit="submit"
          @cancel="onCancel"
        />
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AppLayout from '../shared/app-layout.vue';
import StudioButton from '../shared/studio-button.vue';
import { Plus } from '@lucide/vue';
import UserRow from './components/user-row.vue';
import UserFormModal from './components/user-form-modal.vue';
import { SharedPageProps, UsersProps, UserMeta } from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore } from '../store';
import { sortLanguagesByDisplayName } from '../shared/helpers';

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

const sortedLanguages = computed(() => sortLanguagesByDisplayName(shared.languages));

const focusId = ref(0);
const roles = ['admin', 'editor'];
const formMode = ref('hidden');
const form = useForm(emptyForm);

const focus = (user: UserMeta) => {
  focusId.value = user.id;
  form.name = user.name;
  form.email = user.email;
  form.language = user.language || '';
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
</script>
