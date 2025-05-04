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

export interface IndexReadyItem {
  number: number;
  imageUrl: string;
  title: string;
  tags: string[];
}

export interface IndexItems {
  root: Array<IndexItem>;
}

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
}

export interface Scripture {
  reference: string;
  verse: string;
}

export interface FieldMap {
  [key: string]: FieldSpec;
}

export interface LanguageSpecification {
  language: string;
  languageDirection: 'rtl' | 'ltr';
  locale: string;
  bibleVersion?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface TabItem {
  label: string;
  count: number;
}

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

export interface Meta {
  name: string;
  logo: string;
  storyType: string;
  chapterType: string;
  helpUrl?: string;
  microCopySource?: string;
  hasEditReview: boolean;
  hasAppPreview: boolean;
}

export interface Story {
  id: number;
  name: string;
  fields: Array<object>;
  chapterLimit: number;
  parts?: Array<object>;
}

export interface StorySpec {
  name: string;
  fields: Array<object>;
  chapterLimit: number;
}

export interface Part {
  id: number;
  title: string;
  subtitle: string;
  description: string;
}

export type WidgetPicker = (widget: string) => any; // eslint-disable-line

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

export interface Audio {
  url: string;
  length: number;
}

export interface Video {
  url: string;
}

export interface User {
  id: number;
  name: string;
  initials: string;
  email: string;
  isManager: boolean;
  isAdmin: boolean;
  role: string;
  language: string;
}

export interface DraftMeta {
  id: number;
  number: number;
  status: string;
  updatedAt: string;
  createdAt: string;
}

export interface DraftEditProps {
  draft: DraftMeta; // drafts
  bundle: any; // model
  source?: any; // model
  spec: StorySpec; // drafts
  lastPublished: string; // drafts
  providers: Providers; // widgets
  storyName: string;
}

export interface SharedPageProps {
  errors?: any;
  meta: Meta;
  language: LanguageSpecification;
  languages: LanguageSpecification[];
  stories: string[];
  user: User;
  uiTodoCount: number;
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

export enum AddStatus {
  // eslint-disable-next-line
  Full,
  // eslint-disable-next-line
  Add,
  // eslint-disable-next-line
  Wait,
}

export interface DashboardProps {
  index: IndexReadyItem[];
  addStatus: AddStatus;
  storyName: string;
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
  storyName: string;
  title: string;
  chapterLimit: number;
}

export interface UserMeta {
  id: number;
  name: string;
  email: string;
  language: string;
  role: string;
}

export interface UsersProps {
  users: UserMeta[];
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

export type StoryConfig = {
  meta: Meta;
  languages: {
    locale: string;
    language: string;
    languageDirection: string;
    bibleVersion?: string;
  }[];
  schemaVersion: number;
  stories: {
    id: number;
    name: string;
    fields: FieldSpec[];
    chapterLimit: number;
  }[];
  pages: {
    schemaVersion: number;
    tracking: string;
  };
};

export type StripePayload = {
  isGiftaid: boolean;
  fullName: string;
  amount: number;
  currency: string;
  isNewsletter: boolean;
  successUrl: string;
  cancelUrl: string;
  isRecurring: boolean;
};

export enum FlagState {
  PREFILLED = 'prefilled',
  RECHECK = 'recheck',
}
