import AppLayout from './shared/app-layout.vue';
import Icon from './shared/icon.vue';
import DropDown from './shared/drop-down.vue';
import StringField from './fields/string-field.vue';
import ContextMenu from './shared/context-menu.vue';
import UsersIndex from './users/users-index.vue';
import DashboardIndex from './dashboard/dashboard-index.vue';
import Login from './auth/login-index.vue';
import ForgotPassword from './auth/forgot-password.vue';
import ResetPassword from './auth/reset-password.vue';

export { createInertiaApp, usePage, router } from '@inertiajs/vue3';

export * from './store/index';

export {
  AppLayout,
  UsersIndex,
  Icon,
  DropDown,
  ContextMenu,
  StringField,
  Login,
  ForgotPassword,
  ResetPassword,
  DashboardIndex,
};
