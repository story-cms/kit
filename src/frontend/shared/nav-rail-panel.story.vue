<template>
  <Story title="Nav rail panel" group="shared">
    <Variant title="Admin" :setup-app="loadAdmin">
      <div class="min-h-screen bg-gray-50">
        <Sidebar />
      </div>
    </Variant>

    <Variant title="Editor" :setup-app="loadEditor">
      <div class="min-h-screen bg-gray-50">
        <Sidebar />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import Sidebar from './sidebar.vue';
import { adminUser, editorUser, sharedProps } from '../test/mocks';
import { useSharedStore } from '../store';
import type { AppUserInterface } from '../../types';
import type { StoryHandler } from './helpers';

const loadNav = (user: AppUserInterface): StoryHandler => {
  return (): void => {
    const shared = useSharedStore();
    shared.setFromProps({ ...sharedProps, user });
    shared.setSidebarOpen(true);
  };
};

const loadAdmin = loadNav(adminUser);
const loadEditor = loadNav(editorUser);
</script>

<docs lang="md">
# Nav rail panel

Sidebar navigation with role-based visibility.

## Subscription gating

Links controlled by `config.subscriptions` via `subscribed('feature')`: Streams, Stories, Pages, Resources, Invitations, Audience, Interface.

## Admin gating

Requires `isAdmin && subscribed(...)`:

- **Invitations**
- **Settings**

## Admin only

Requires `isAdmin`:

- **Team**

Compare the **Admin** and **Editor** variants: editors see content links but not Invitations, Settings, or Team.
</docs>
