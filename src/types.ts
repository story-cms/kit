/// ----------------------------------------------------
///  these enums can not be imported into vue files
/// ----------------------------------------------------
export enum AddStatus {
  // eslint-disable-next-line
  Full,
  // eslint-disable-next-line
  Add,
  // eslint-disable-next-line
  Wait,
}

export enum ResponseStatus {
  // eslint-disable-next-line
  Failure,
  // eslint-disable-next-line
  Confirmation,
  // eslint-disable-next-line
  Accomplishment,
  // eslint-disable-next-line
  Neutral,
  // eslint-disable-next-line
  None,
}

export enum FlagState {
  PREFILLED = 'prefilled',
  RECHECK = 'recheck',
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
  toolbar?: string[];
  description?: string;
  extensions?: string[];
  maxSize?: number;
  tintColor?: string;
  labelOrder?: string;
  folder?: string;
  collectionId?: string;
  hasTimePicker?: boolean;
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

export type WidgetPicker = (widget: string) => any; // eslint-disable-line

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
export interface StreamIndexProps {
  stream: StreamIndexItem;
  drops: DropIndexItem[];
}
export interface DropIndexItem {
  id: number;
  title: string;
  coverImage: string;
  releaseAt: string;
  isPublished: boolean;
}

export interface StreamIndexItem {
  id: number;
  title: string;
  coverImage: string;
  latestReleaseAt: string;
  count: number;
}

export interface StreamGalleryProps {
  streams: StreamIndexItem[];
}

export interface DropIndexItem {
  id: number;
  title: string;
  coverImage: string;
  releaseAt: string;
  isPublished: boolean;
}

export interface StreamIndexProps {
  stream: StreamIndexItem;
  drops: DropIndexItem[];
}

export interface DropMeta {
  id: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface StreamEditProps {
  meta: DropMeta;
  spec: StreamSpec;
  model: any; // model
  providers: Providers; // widgets
}

export const dropIndexItemFields: FieldSpec[] = [
  {
    name: 'title',
    label: 'Title',
    widget: 'string',
  },
  {
    name: 'coverImage',
    label: 'Cover Image',
    widget: 'image',
    description: 'JPG up to 200KB',
    extensions: ['.jpeg', '.jpg'],
    maxSize: 200000,
  },
  {
    name: 'releaseAt',
    label: 'Release At',
    widget: 'datetime',
  },
];

/// ----------------------------------------------------
///  stories
/// ----------------------------------------------------

export interface StorySpec {
  id: number;
  name: string;
  coverImage: string;
  chapterLimit: number;
  chapterType: string;
  storyType: string;
  schemaVersion: number;
  fields: FieldSpec[];
  parts?: Array<Part>;
}

export interface StoryIndexItem {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  chapterLimit: number;
  createdAt: string;
  updatedAt: string;
  draftCount: number;
}

export interface Version {
  apiVersion: number;
  storyId: number;
  locale: string;
}

export interface Specifier {
  apiVersion: number;
  storyId: number;
  locale: string;
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
  createdAt: string;
  updatedAt: string;
};

export interface StoryEditProps {
  story: StoryMeta;
  isNew: boolean;
  providers: Providers;
}

export interface StoryIndexProps {
  index: IndexReadyItem[];
  addStatus: AddStatus;
  story: StorySpec;
}

export interface StoryIndexItem {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  chapterLimit: number;
  createdAt: string;
  updatedAt: string;
  draftCount: number;
}

export interface StoryGalleryProps {
  stories: StoryIndexItem[];
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
}

export interface PageVersion {
  apiVersion: number;
  locale: string;
}

export interface PageBundle {
  group: number;
  title: string;
  icon: string;
  description: string;
  body: string;
}

export interface SharedPageProps {
  meta: CmsMeta;
  user: UserInterface;
  language: LanguageSpecification;
  languages: LanguageSpecification[];
  errors?: any;
  exclude: string[];
  bookmarks?: Bookmark[];
}

export interface PageMeta {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageBundle {
  group: number;
  title: string;
  icon: string;
  description: string;
  body: string;
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

export interface UserMeta
  extends Pick<
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
///  audiences
/// ----------------------------------------------------

export interface AudienceMeta {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  signUpDate: string;
  lastSignInTime: string;
}

export interface AudiencesProps {
  audiences: AudienceMeta[];
}

/// ----------------------------------------------------
///  configuration
/// ----------------------------------------------------

export interface Bookmark {
  label: string;
  link: string;
}

export interface CmsMeta {
  name: string;
  logo: string;
  helpUrl?: string;
  hasAppPreview: boolean;
}

export type CmsConfig = {
  meta: CmsMeta;

  languages: {
    languages: LanguageSpecification[];
    microcopySource: string;
  };

  streams: {
    streams: StreamSpec[];
  };

  stories: {
    hasEditReview: boolean;
    stories: StorySpec[];
  };

  pages: {
    schemaVersion: number;
    tracking: string;
  };
};

export interface LanguageSpecification {
  language: string;
  languageDirection: 'rtl' | 'ltr';
  locale: string;
  bibleVersion?: string;
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
}
