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

    <Variant title="Active: Stories" :setup-app="loadActiveStories">
      <div class="min-h-screen bg-gray-50">
        <Sidebar />
      </div>
    </Variant>

    <Variant title="Active: Pages" :setup-app="loadActivePages">
      <div class="min-h-screen bg-gray-50">
        <Sidebar />
      </div>
    </Variant>

    <Variant title="Active: Resources" :setup-app="loadActiveResources">
      <div class="min-h-screen bg-gray-50">
        <Sidebar />
      </div>
    </Variant>

    <Variant title="Active: Audience" :setup-app="loadActiveAudience">
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

const loadNavAtPath = (user: AppUserInterface, path: string): StoryHandler => {
  return (): void => {
    const shared = useSharedStore();
    shared.setFromProps({ ...sharedProps, user });
    shared.setSidebarOpen(true);
    history.replaceState(null, '', `/en/${path}`);
  };
};

const loadAdmin = loadNav(adminUser);
const loadEditor = loadNav(editorUser);

const loadActiveStories = loadNavAtPath(editorUser, 'story');
const loadActivePages = loadNavAtPath(editorUser, 'page');
const loadActiveResources = loadNavAtPath(editorUser, 'resource');
const loadActiveAudience = loadNavAtPath(editorUser, 'audience');
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

## Active state

**Active:** variants simulate the current route with `history.replaceState` (e.g. `/en/story`). The matching nav item receives the `.active` class (`bg-blue-50`).
</docs>
