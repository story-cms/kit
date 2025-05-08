import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { computed, ref, reactive, toRefs } from 'vue';
import {
  SharedPageProps,
  Meta,
  LanguageSpecification,
  User,
  ResponseStatus,
} from '../../types';

const defaultLanguage: LanguageSpecification = {
  locale: 'en',
  language: 'English',
  languageDirection: 'ltr',
};

export const useSharedStore = defineStore('shared', () => {
  const stories: Ref<string[]> = ref([]);
  const meta: Ref<Meta> = ref({} as Meta);
  const user: Ref<User> = ref({} as User);
  const languages: Ref<LanguageSpecification[]> = ref([] as LanguageSpecification[]);

  const setFromProps = (props: SharedPageProps) => {
    errors.value = toRefs(props.errors) as any;
    stories.value = props.stories;
    meta.value = props.meta;
    languages.value = props.languages;
    user.value = props.user;
    language.value = props.language;
    uiTodoCount.value = props.uiTodoCount;
    currentStoryName.value = props.storyName;
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

  const hasFloatingSidebar = ref(false);

  const setSidebarAsFloating = (isFloating: boolean) => {
    hasFloatingSidebar.value = isFloating;
  };

  const hasOpenSidebar = ref(true);

  const setSidebarOpen = (isOpen: boolean) => {
    hasOpenSidebar.value = isOpen;
  };

  const currentStoryName = ref('');

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

  // ui counter

  const uiTodoCount: Ref<number> = ref(0);

  const setUiTodoCount = (fresh: number) => {
    uiTodoCount.value = fresh;
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

  return {
    stories,
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

    hasFloatingSidebar,
    setSidebarAsFloating,

    hasOpenSidebar,
    setSidebarOpen,

    currentStoryName,

    uiTodoCount,
    setUiTodoCount,

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
  };
});
