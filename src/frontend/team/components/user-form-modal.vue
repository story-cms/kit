<template>
  <LanguageModal :open="open" :title="modalTitle" @close="emit('cancel')">
    <!-- eslint-disable vue/no-mutating-props -- Inertia useForm state is passed by reference -->
    <form @submit.prevent="emit('submit')">
      <div v-if="otherError" class="py-4 text-error">
        {{ otherError }}
      </div>
      <div class="flex flex-col gap-4">
        <div>
          <label class="input-label" for="name">Name</label>
          <div class="mt-[2px] pt-1">
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
          <label class="input-label" for="email">Email</label>
          <div class="mt-[2px] pt-1">
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

        <div v-if="showRoleField">
          <label class="input-label" for="role">Role</label>
          <select id="role" v-model="form.role" class="input-field mt-[2px]">
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
          <label class="input-label" for="language">Language</label>
          <select id="language" v-model="form.language" class="input-field mt-[2px]">
            <option value="*" :selected="form.language === '*'">All Languages</option>
            <option
              v-for="lang in sortedLanguages"
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
    </form>

    <template #actions>
      <div class="mt-9 flex w-full justify-end gap-x-4">
        <StudioButton :label="submitLabel" variant="blue" @click="emit('submit')" />
        <StudioButton label="Cancel" variant="gray" @click="emit('cancel')" />
      </div>
    </template>
  </LanguageModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LanguageModal from '../../settings/languages/components/language-modal.vue';
import StudioButton from '../../shared/studio-button.vue';
import type { LanguageSortable } from '../../shared/helpers';

type UserFormData = {
  name: string;
  email: string;
  language: string;
  role: string;
};

type UserFormErrors = Partial<
  Record<'name' | 'email' | 'language' | 'role' | 'other', string | string[]>
>;

type UserForm = UserFormData & {
  errors: UserFormErrors;
};

const props = defineProps<{
  open: boolean;
  form: UserForm;
  formMode: 'add' | 'update';
  focusId: number;
  currentUserId: number;
  roles: string[];
  sortedLanguages: LanguageSortable[];
}>();

const emit = defineEmits<{
  submit: [];
  cancel: [];
}>();

const modalTitle = computed(() =>
  props.formMode === 'update' ? 'Update user' : 'Add user',
);

const otherError = computed((): string => {
  const error = props.form.errors.other;
  return typeof error === 'string' ? error : '';
});

const submitLabel = computed(() =>
  props.formMode === 'update' ? 'Update' : 'Add User',
);

const showRoleField = computed(() => props.focusId !== props.currentUserId);
</script>
