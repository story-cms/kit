<template>
  <Story title="Users Page" group="users">
    <Variant title="Index">
      <UsersIndex
        :users="users"
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :stories="['John', 'Acts']"
      />
    </Variant>
    <Variant title="With feedback" :setup-app="loadData">
      <UsersIndex
        :users="users"
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :stories="['John', 'Acts']"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import UsersIndex from './users-index.vue';
import { sharedProps } from '../test/mocks';
import type { UserMeta } from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore } from '../store';

const users: UserMeta[] = [
  {
    id: 1,
    name: 'John',
    email: 'jcalvin@example.com',
    language: '*',
    role: 'admin',
  },
  {
    id: 2,
    name: 'John',
    email: 'jpiper@example.com',
    language: 'en',
    role: 'editor',
  },
];

const loadData = () => {
  const shared = useSharedStore();

  shared.addMessage(ResponseStatus.Accomplishment, 'User updated successfully');
};
</script>
