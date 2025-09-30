import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { computed, ref, reactive, shallowRef } from 'vue';
import {
  type SharedPageProps,
  type LanguageSpecification,
  type Bookmark,
  type CmsMeta,
  type UserInterface,
  ResponseStatus,
} from '../../types';
import standardSidebar from '../shared/sidebar.vue';

const defaultLanguage: LanguageSpecification = {
  locale: 'en',
  language: 'English',
  languageDirection: 'ltr',
};

export const useSharedStore = defineStore('shared', () => {
  const exclude: Ref<string[]> = ref([]);
  const meta: Ref<CmsMeta> = ref({} as CmsMeta);
  const user: Ref<UserInterface> = ref({} as UserInterface);
  const languages: Ref<LanguageSpecification[]> = ref([] as LanguageSpecification[]);
  const bookmarks: Ref<Bookmark[]> = ref([]);

  const setFromProps = (props: SharedPageProps) => {
    meta.value = props.meta;
    user.value = props.user;
    languages.value = props.languages;
    language.value = props.language;
    errors.value = { ...props.errors };
    exclude.value = props.exclude;
    bookmarks.value = props.bookmarks ?? [];
  };

  // errors

  const errors: Ref<Record<string, string[]>> = ref({});

  const setErrors = (fresh: any) => {
    errors.value = fresh;
  };

  const clearErrors = () => {
    errors.value = <Record<string, string[]>>{};
  };

  const errorMessages = (path: string): string[] => {
    if (!errors.value) return [];
    const messages = errors.value[`bundle.${path}`] || [];
    return messages;
  };

  // window size

  const isLargeScreen = ref(false);

  const setLargeScreen = (fresh: boolean) => {
    isLargeScreen.value = fresh;
  };

  // sidebar

  const sidebar = shallowRef<typeof standardSidebar>(standardSidebar);

  const setSidebar = (fresh: typeof standardSidebar) => {
    sidebar.value = fresh;
  };

  const hasOpenSidebar = ref(true);

  const setSidebarOpen = (isOpen: boolean) => {
    hasOpenSidebar.value = isOpen;
  };

  const currentStoryName = ref('');
  const setCurrentStoryName = (name: string) => {
    currentStoryName.value = name;
  };

  // main and header

  const isMainUnderHeader = ref(false);

  const setMainUnderHeader = (isUnder: boolean) => {
    isMainUnderHeader.value = isUnder;
  };

  const headerHeight = ref(0);
  const headerWidth = ref(0);
  const layoutWidth = ref(0);
  const containerWidth = ref(0);

  const setLayoutWidth = (fresh: number) => {
    layoutWidth.value = fresh;
  };

  const setHeaderSize = (height: number, width: number) => {
    headerHeight.value = height;
    headerWidth.value = width;
  };

  const setContainerWidth = (fresh: number) => {
    containerWidth.value = fresh;
  };

  // message centre

  const messageCentre = reactive({
    response: ResponseStatus.None as ResponseStatus,
    message: '' as string,
  });

  const addMessage = (response: ResponseStatus, message: string) => {
    messageCentre.response = response;
    messageCentre.message = message;
    setTimeout(() => {
      messageCentre.response = ResponseStatus.None;
      messageCentre.message = '';
    }, 2500);
  };
  const hasFeedback = computed(() => messageCentre.response !== ResponseStatus.None);

  // language

  const KingJamesVersion = 'de4e12af7f28f599-01';
  const language = ref(defaultLanguage);
  const languageDirection = computed(() => language.value.languageDirection);
  const isRtl = computed(() =>
    language.value.languageDirection === 'rtl' ? true : false,
  );
  const locale = computed(() => language.value.locale);
  const bibleVersion = computed(() => language.value.bibleVersion ?? KingJamesVersion);

  const isTranslation = computed(() => language.value.locale !== defaultLanguage.locale);

  const setLanguage = (fresh: LanguageSpecification) => {
    language.value = fresh;
  };

  // content sidebar
  const isSingleColumn = ref(false);
  const setSingleColumn = (value: boolean) => {
    isSingleColumn.value = value;
  };

  const showMetaBox = ref(true);
  const setShowMetaBox = (value: boolean) => {
    showMetaBox.value = value;
  };

  const showAppPreview = ref(true);
  const setShowAppPreview = (value: boolean) => {
    showAppPreview.value = value;
  };

  const showSourceColumn = ref(true);
  const setSourceColumnAsHidden = (value: boolean) => {
    showSourceColumn.value = value;
  };

  // bookmarks
  const setBookmarks = (value: Bookmark[]) => {
    bookmarks.value = value;
  };

  const isBookmarked = (bookmark: Bookmark): boolean => {
    return bookmarks.value.some(
      (b) => b.label === bookmark.label && b.link === bookmark.link,
    );
  };

  return {
    exclude,
    meta,
    languages,
    errors,
    user,
    messageCentre,
    hasFeedback,

    isLargeScreen,
    setLargeScreen,

    isMainUnderHeader,
    setMainUnderHeader,
    headerHeight,
    headerWidth,
    setHeaderSize,
    layoutWidth,
    setLayoutWidth,
    containerWidth,
    setContainerWidth,

    sidebar,
    setSidebar,
    hasOpenSidebar,
    setSidebarOpen,

    currentStoryName,
    setCurrentStoryName,

    language,
    languageDirection,
    locale,
    isRtl,
    bibleVersion,
    isTranslation,
    setLanguage,

    setErrors,
    clearErrors,
    errorMessages,
    setFromProps,
    addMessage,

    isSingleColumn,
    setSingleColumn,

    showSourceColumn,
    setSourceColumnAsHidden,

    showMetaBox,
    setShowMetaBox,

    showAppPreview,
    setShowAppPreview,

    bookmarks,
    setBookmarks,
    isBookmarked,
  };
});
