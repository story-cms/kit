import ActionButton from './shared/action-button.vue';
import AddItemButton from './shared/add-item-button.vue';
import AnimationField from './fields/animation-field.vue';
import AppLayout from './shared/app-layout.vue';
import AudiencesIndex from './audiences/audiences-index.vue';
import AudioField from './fields/audio-field.vue';
import BooleanField from './fields/boolean-field.vue';
import CampaignsEdit from './campaign/campaign-edit.vue';
import ChapterPreview from './stories/chapter-preview.vue';
import ContentHeader from './shared/content-header.vue';
import ContextMenu from './shared/context-menu.vue';
import CreateAccount from './auth/create-account.vue';
import DashboardIndex from './dashboard/dashboard-index.vue';
import DateField from './fields/date-field.vue';
import DateRangeField from './fields/date-range-field.vue';
import DraftIndex from './stories/draft-index.vue';
import DropDown from './shared/drop-down.vue';
import ForgotPassword from './auth/forgot-password.vue';
import Icon from './shared/icon.vue';
import IconButton from './shared/icon-button.vue';
import ImageField from './fields/image-field.vue';
import IndexCard from './stories/components/index-card.vue';
import IndexFilter from './shared/index-filter.vue';
import LabelButton from './shared/label-button.vue';
import ListField from './fields/list-field.vue';
import ListSwitcher from './shared/list-switcher.vue';
import Login from './auth/login-index.vue';
import MarkdownField from './fields/markdown-field.vue';
import MetaBox from './shared/meta-box.vue';
import NullField from './fields/null-field.vue';
import NumberField from './fields/number-field.vue';
import ObjectField from './fields/object-field.vue';
import PageIndexItem from './pages/page-index-item.vue';
import PagesEdit from './pages/pages-edit.vue';
import PagesIndex from './pages/pages-index.vue';
import Pagination from './shared/pagination.vue';
import PanelField from './fields/panel-field.vue';
import PublicLayout from './shared/public-layout.vue';
import RegionField from './fields/region-field.vue';
import ResetPassword from './auth/reset-password.vue';
import ScriptureField from './fields/scripture-field.vue';
import SelectField from './fields/select-field.vue';
import StatusTag from './shared/status-tag.vue';
import StoryEdit from './stories/story-edit.vue';
import StoryGallery from './stories/story-gallery.vue';
import StoryIndex from './stories/story-index.vue';
import DropEdit from './streams/drop-edit.vue';
import StreamGallery from './streams/stream-gallery.vue';
import StreamIndex from './streams/stream-index.vue';
import StringField from './fields/string-field.vue';
import TagField from './fields/tag-field.vue';
import ToggleButton from './shared/toggle-button.vue';
import TranslationIndex from './stories/translation-index.vue';
import UiPage from './ui/ui-page.vue';
import UsersIndex from './team/users-index.vue';
import VideoField from './fields/video-field.vue';

export { createInertiaApp, usePage, useForm, router } from '@inertiajs/vue3';

export * from './store/index';

export { commonProps } from './shared/helpers';

// Re-export types for easier access
export * from '../types';

export {
  ActionButton,
  AddItemButton,
  AnimationField,
  AppLayout,
  AudiencesIndex,
  AudioField,
  BooleanField,
  CampaignsEdit,
  ChapterPreview,
  ContentHeader,
  ContextMenu,
  CreateAccount,
  DashboardIndex,
  DateField,
  DateRangeField,
  DraftIndex,
  DropDown,
  ForgotPassword,
  Icon,
  IconButton,
  ImageField,
  IndexCard,
  IndexFilter,
  LabelButton,
  ListField,
  ListSwitcher,
  Login,
  MarkdownField,
  MetaBox,
  NullField,
  NumberField,
  ObjectField,
  PageIndexItem,
  PagesEdit,
  PagesIndex,
  PanelField,
  Pagination,
  PublicLayout,
  RegionField,
  ResetPassword,
  ScriptureField,
  SelectField,
  StatusTag,
  StoryEdit,
  StoryGallery,
  StoryIndex,
  DropEdit,
  StreamGallery,
  StreamIndex,
  StringField,
  TagField,
  ToggleButton,
  TranslationIndex,
  UiPage,
  UsersIndex,
  VideoField,
};
