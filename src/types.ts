/// ----------------------------------------------------
///  these enums can not be imported into vue files
/// ----------------------------------------------------

export enum AddStatus {
  Full,
  Add,
  Wait,
}

export enum ResponseStatus {
  Failure,
  Confirmation,
  Accomplishment,
  Neutral,
  None,
}

export enum FlagState {
  PREFILLED = 'prefilled',
  RECHECK = 'recheck',
}

/// ----------------------------------------------------
///  selectors
/// ----------------------------------------------------

export interface Version {
  apiVersion: number;
  locale: string;
}

export type VisibilityType = 'public' | 'guests' | 'leaders';

export interface LabelHintSection {
  title: string;
  description: string;
}

/// ----------------------------------------------------
///  fields
/// ----------------------------------------------------

export interface FieldSpec {
  name: string;
  label: string;
  widget: string;
  // specialized
  index?: string;
  fields?: FieldSpec[] | FieldMap;
  canFold?: boolean;
  isRow?: boolean;
  uploadPreset?: string;
  options?: Array<SelectOption>;
  default?: any;
  minimal?: boolean;
  noMarkup?: boolean;
  toolbar?: string[];
  description?: string;
  placeholderText?: string;
  hint?: string;
  hintSections?: LabelHintSection[];
  hintFooter?: string;
  panelErrorMessage?: string;
  labelStyle?: 'header' | 'pill';
  extensions?: string[];
  maxSize?: number;
  tintColor?: string;
  backgroundColor?: string;
  labelOrder?: string;
  folder?: string;
  collectionId?: string;
  hasTimePicker?: boolean;
  allowMany?: boolean;
  isFlexible?: boolean;
}

export interface Scripture {
  reference: string;
  verse: string;
}

export interface FieldMap {
  [key: string]: FieldSpec;
}

export interface Audio {
  url: string;
  length: number;
}

export interface Video {
  url: string;
}

export type WidgetPicker = (widget: string) => any;

/**
 * Type-safe wrapper for JSON columns that preserves the generic parameter
 * while ensuring JSON-serializable values at runtime.
 */
export type JSON<T> = T;

/// ----------------------------------------------------
///  streams
/// ----------------------------------------------------

export interface StreamIndexItem {
  id: number;
  title: string;
  coverImage: string;
  latestReleaseAt: string;
  count: number;
}

export interface StreamIndexProps {
  stream: StreamIndexItem;
  drops: DropIndexItem[];
}

export interface StreamGalleryProps {
  streams: StreamIndexItem[];
}

export interface StreamSpec {
  id: number;
  title: string;
  coverImage: string;
  streamType: string;
  dropType: string;
  schemaVersion: number;
  fields: FieldSpec[];
}

export interface DropIndexItem {
  id: number;
  title: string;
  coverImage: string;
  releaseAt: string;
  isPublished: boolean;
}

export interface DropMeta {
  id: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface StreamEditProps {
  dropMeta: DropMeta;
  spec: StreamSpec;
  model: any; // model
  providers: Providers; // widgets
}

/// ----------------------------------------------------
///  resources
/// ----------------------------------------------------

export interface TextBundle {
  content: string;
}

export interface VideoBundle {
  video: { url: string };
}

export interface LinkBundle {
  url: string;
}

export type ResourceType = 'text' | 'url' | 'video';
export type ResourceBundle = TextBundle | VideoBundle | LinkBundle;

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  imageUrl?: string | null;
  url?: string;
  label: string | null;
  visibility: VisibilityType;
  description?: string | null;
  updatedAt: string;
}

export interface ResourceIndexItem extends ResourceItem {
  createdAt: string;
  usedInCount: number;
}

export interface ResourceMeta {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceIndexProps {
  resources: ResourceIndexItem[];
}

export interface ResourceUsage {
  id: number;
  title: string;
}

export interface ResourceEditProps {
  providers: Providers;
  resource: ResourceMeta;
  bundle: any;
  usedInStories: ResourceUsage[];
}

export type ResourceNotFoundProps = SharedPageProps;

export type ResourcePayload = {
  title: string;
  type: ResourceType;
  imageUrl?: string | null;
  description?: string | null;
  label?: string | null;
  visibility: VisibilityType;
  content?: string;
  url?: string;
  video?: { url: string | null };
};

/// ----------------------------------------------------
///  stories
/// ----------------------------------------------------

export interface StorySection {
  id: string; // uuid
  title: string;
  description?: string;
}

export interface StorySpec {
  id: number;
  name: string;
  coverImage: string;
  chapterLimit: number;
  chapterType: string;
  storyType: string;
  visibility: string;
  schemaVersion: number;
  isPublished: boolean;
  fields: FieldSpec[];
  sections: Array<StorySection>;
  parts?: Array<Part>;
}

export interface StoryUpdatePayload {
  title: string;
  coverImage: string;
  description: string;
  chapterLimit: number;
  storyType: string;
  chapterType: string;
  sectionType: string | null;
  tags: string | null;
  visibility: string;
  sections: StorySection[];
  resources: string[];
  isPublished: boolean;
}

export interface StoryIndexItem {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  chapterLimit: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  liveCount: number;
  draftCount: number;
}

export interface StoryVersion extends Version {
  storyId: number;
}

export interface StorySpecifier extends StoryVersion {
  number: number;
}

export interface IndexItem {
  number: number;
  imageUrl: string;
  title: string;
  reference?: string;
  part?: number;
}

export interface Part {
  id: number;
  title: string;
  subtitle: string;
  description: string;
}

export interface GroupedIndexItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  index: { id: number; title: string; imageUrl: string }[];
}

export interface IndexReadyItem {
  number: number;
  imageUrl: string;
  title: string;
  tags: string[];
}

export interface IndexItems {
  root: Array<IndexItem>;
}

export interface DraftMeta {
  id: number;
  number: number;
  status: string;
  updatedAt: string;
  createdAt: string;
}

export type StoryMeta = {
  id: number;
  name: string;
  storyType: string;
  chapterType: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface JournaStoryEditProps {
  story: StoryMeta;
  providers: Providers;
  isNew: boolean;
}

export interface StoryCreateProps {
  model: {
    title: string;
    coverImage: string;
    description: string;
    chapterLimit: number | null;
    tags: string | null;
    storyType: string | null;
    chapterType: string | null;
    sectionType: string | null;
    visibility: string;
    slug: string | null;
    template: string;
    sections: StorySection[];
  };
  templates: BundleTemplate[];
  providers: Providers;
  availableResources: ResourceItem[];
}

export interface StoryEditProps {
  model: {
    id: number;
    title: string;
    coverImage: string;
    description: string;
    chapterLimit: number;
    tags: string | null;
    storyType: string | null;
    chapterType: string | null;
    sectionType: string | null;
    visibility: string;
    slug: string;
    template: string;
    isPublished: boolean;
    sections: StorySection[];
    resources: ResourceItem[];
  };
  source?: {
    title: string;
    coverImage: string;
    description: string;
    tags: string | null;
    sections: StorySection[];
    resources: ResourceItem[];
  };
  availableResources: ResourceItem[];
  hasNoContent: boolean;
  templates: BundleTemplate[];
  providers: Providers;
}

export interface StoryIndexProps {
  index: IndexReadyItem[];
  addStatus: AddStatus;
  story: StorySpec;
  canEditStory?: boolean;
}

export interface StoryGalleryProps {
  stories: StoryIndexItem[];
}

export interface LocaleStoriesItem {
  locale: string;
  stories: string[];
}

export interface LocaleItem {
  locale: string;
  name: string;
  nativeName: string;
}

export interface LocaleStoriesResponse {
  content: LocaleStoriesItem[];
  app: LocaleItem[];
}

export interface DraftEditProps {
  draft: DraftMeta; // drafts
  bundle: any; // model
  source?: any; // model
  providers: Providers; // widgets
  lastPublished: string; // drafts
  story: StorySpec;
  hasEditReview: boolean;
}

export interface ChapterMeta {
  number: number;
  createdAt: string;
  updatedAt: string;
}

export interface PreviewProps {
  chapter: ChapterMeta;
  bundle: any;
  bundleView: string;
  story: StorySpec;
  title: string;
}

export interface ValidatorType {
  validate: (data: any) => Promise<any>;
}

/// ----------------------------------------------------
///  pages
/// ----------------------------------------------------

// used for editing the pages
export interface PageItem {
  id: number;
  group?: number;
  title?: string;
  icon?: string;
  description?: string;
  body?: string;
  isPublished?: boolean;
  isDivider?: boolean;
  category?: string;
}

export interface PageBundle {
  group: number;
  title: string;
  icon: string;
  description: string;
  body: string;
}

export interface SharedPageProps {
  user: AppUserInterface;
  config: UiConfig;
  language: LanguageSpecification;
  errors?: any;
  bookmarks?: Bookmark[];
}

export interface PageMeta {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageIndexProps {
  pages: PageItem[];
}

export interface PageEditProps {
  page: PageMeta;
  bundle: any; // model
  providers: Providers; // widgets
}

/// ----------------------------------------------------
///  team
/// ----------------------------------------------------

export type UserRole = 'admin' | 'editor';

export interface AppUserInterface {
  id: number;
  name: string;
  isAdmin: boolean;
  isManager: boolean;
  role: string;
}

export interface UserInterface {
  id: number;
  name: string;
  initials: string;
  email: string;
  isManager: boolean;
  isAdmin: boolean;
  role: string;
  language: string | null;
  hasPendingInvite: boolean;
  isAllowed: (locale: string) => boolean;
}

export interface UserMeta extends Pick<
  UserInterface,
  'id' | 'name' | 'email' | 'role' | 'language' | 'initials' | 'hasPendingInvite'
> {
  lastActivity: string | null;
}

export interface UsersProps {
  users: UserMeta[];
}

/// ----------------------------------------------------
///  ui
/// ----------------------------------------------------

export interface UiItem {
  key: string;
  source: string;
  translation?: string;
  description?: string;
  placeholders?: string[];
  flag?: string;
  updatedAt?: string;
}

export type UiItemPayload = {
  key: string;
  locale: string;
  translation: string;
  isPrefilled: boolean;
};

export interface UiPageProps {
  items: UiItem[];
}

/// ----------------------------------------------------
///  layouts
/// ----------------------------------------------------

export interface SelectOption {
  label: string;
  value: string;
}

export interface TabItem {
  label: string;
  count: number;
}

/** Tabs for `navigation-pane` and `tab-navigation` (icon + label). */
export interface NavigationPaneTab {
  label: string;
  /** Registered `Icon` name; Lucide icons are passed via the component `icons` prop. */
  icon?: string;
  /** When true, tab shows validation error styling. */
  hasError?: boolean;
}

export interface StatMetric {
  name: string;
  stat: number;
  previousStat: number;
}

export interface Progress {
  name: string;
  done: number;
  draft: number;
  total: number;
  lastUpdated: string;
}

export interface TranslationProgress {
  progress: Progress[];
  language: string;
  locale: string;
  isReadOnly: boolean;
}

export interface DashboardProps {
  translationProgress: TranslationProgress[];
}

/// ----------------------------------------------------
///  audience
/// ----------------------------------------------------

export interface AudienceMeta {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  signUpDate: string;
  lastSignInTime: string;
}

export interface AudienceProps {
  audience: AudienceMeta[];
  nextPageToken?: string | null;
}

/** JSON body for GET `/:locale/audience/users` (cursor pagination). */
export interface AudienceUsersPageResponse {
  users: AudienceMeta[];
  nextPageToken: string | null;
}

/// ----------------------------------------------------
///  invitations
/// ----------------------------------------------------

export interface InvitationMeta {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationStats {
  impressions: number;
  clicks: number;
}

export interface InvitationEditProps {
  invitation: InvitationMeta;
  stats: InvitationStats;
  bundle: any; // model
  providers: Providers; // widgets
}

export interface InvitationBundle {
  name: string;
  regions: string;
  window: string;
  promoImage?: string;
  videoUrl?: string;
  title: string;
  message: string;
  actionLabel: string;
  actionType: string;
  actionUrl?: string;
}

export interface InvitationItem {
  id: number;
  name?: string;
  regions?: string;
  window?: string;
  isPublished: boolean;
}

export interface InvitationIndexProps {
  invitations: InvitationItem[];
}

export interface InvitationForApi {
  id: number;
  startDate: string | null;
  endDate: string | null;
  promoImage: string;
  videoUrl: string | null;
  title: string;
  message: string;
  actionLabel: string;
  actionType: string;
  actionUrl: string;
  regions: string;
}

/// ----------------------------------------------------
///  configuration
/// ----------------------------------------------------

// trackable settings should not be nested
// no optional settings in the type definition
export type CmsConfig = {
  name: string;
  logo: string;
  helpUrl: string;
  supportEmail: string;
  hasAppPreview: boolean;
  microcopySource: string;
  videoCollectionId: string;
  languages: LanguageSpecification[];
  subscriptions: Subscription[];

  pagesTracking: string;
  // any bespoke story or stream templates
  bespokeTemplates: BundleTemplate[];

  // will be deprecated in favour of streams table and template
  streams: StreamSpec[];
  // streamTemplates: BundleTemplate[];

  storiesHasEditReview: boolean;
  storyTemplates: BundleTemplate[];
};

export interface Bookmark {
  label: string;
  link: string;
}

export interface UiConfig {
  name: string;
  logo: string;
  helpUrl: string;
  supportEmail: string;
  hasAppPreview: boolean;
  videoCollectionId: string;
  languages: LanguageSpecification[];
  subscriptions: Subscription[];
}

export type Subscription =
  | 'story'
  | 'multi-story'
  | 'stream'
  | 'language'
  | 'audience'
  | 'invitation'
  | 'resource'
  | 'settings'
  | 'ui'
  | 'page';

export interface BundleTemplate {
  id: string;
  name: string;
  fields: FieldSpec[];
}

export interface LanguageSpecification {
  language: string;
  languageDirection: 'rtl' | 'ltr';
  locale: string;
  bibleVersion?: string;
  bibleLabel?: string;
}

export interface LanguageTableItem extends LanguageSpecification {
  translationProgress?: Omit<Progress, 'lastUpdated'>[];
  teamMembers?: UserMeta[];
}

export interface Providers {
  s3?: {
    accessKeyId: string;
    accessKey: string;
    bucket: string;
    region: string;
    endpoint: string;
    folder?: string;
    customDomain?: string;
  };

  cloudinary?: {
    apiKey: string;
    secret: string;
    defaultPreset: string;
    cloudName: string;
  };

  scripture?: {
    bibleApiKey: string;
  };

  bunny?: {
    accessKey: string;
    libraryId: string;
    host: string;
  };

  supportEmail?: string;
}
/// ----------------------------------------------------
///  settings
/// ----------------------------------------------------

export interface SettingsPageProps {
  sourceLanguage: LanguageTableItem;
  languageItems: LanguageTableItem[];
  providers: Providers;
  requireAppUpdate: boolean;
}

export interface LanguagesEditProps {
  addedLanguages: LanguageSpecification[];
}

export interface LanguageListItemProps {
  language: LanguageSpecification;
  status: 'selected' | 'readonly' | 'available';
}

export type SupportCode =
  'REMOVE_LANGUAGE' | 'UPDATE_LANGUAGE' | 'UPDATE_CONTENT' | 'UPDATE_APP';

export interface SupportRequest {
  supportCode: SupportCode;
  removeLanguageCode?: string;
}
