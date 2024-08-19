import AppLayout from './shared/app-layout.vue';
import Icon from './shared/icon.vue';
import DropDown from './shared/drop-down.vue';
import StringField from './fields/string-field.vue';
import ContextMenu from './shared/context-menu.vue';
import UsersIndex from './users/users-index.vue';
export { createInertiaApp, usePage, router } from '@inertiajs/vue3';

// Adonis plugin:
// export { configure } from '../configure.js';
// export { stubsRoot } from '../stubs/main.js';
// export { defineConfig } from './define_config.js';
export * from './interfaces';
export * from './store/index';

export { AppLayout, UsersIndex, Icon, DropDown, ContextMenu, StringField };
