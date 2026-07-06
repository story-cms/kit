import { computed } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { useSharedStore } from '../store';
import type { Subscription } from '../../types';
import {
  languageDisplayName,
  normalizePathForLanguageSwitch,
  parentPathForBack,
  replaceLocaleInPath,
  type LanguageSortable,
} from './helpers';

function isEnglishLanguage(item: LanguageSortable): boolean {
  return (
    item.locale === 'en' ||
    languageDisplayName(item.language).localeCompare('English', undefined, {
      sensitivity: 'base',
    }) === 0
  );
}

/** English first, then remaining languages A–Z by display name. */
function compareLanguages(a: LanguageSortable, b: LanguageSortable): number {
  if (isEnglishLanguage(a) && !isEnglishLanguage(b)) return -1;
  if (!isEnglishLanguage(a) && isEnglishLanguage(b)) return 1;
  return languageDisplayName(a.language).localeCompare(languageDisplayName(b.language));
}

function sortLanguages<T extends LanguageSortable>(languages: T[]): T[] {
  return [...languages].sort(compareLanguages);
}

export function useSidebarNav() {
  const shared = useSharedStore();
  const page = usePage();

  const sidebarLanguages = computed(() => sortLanguages(shared.languages));

  const newPathFromLocale = (targetLocale: string) => {
    const pageUrl = page.url || `${window.location.pathname}${window.location.search}`;
    const [pathname, search = ''] = pageUrl.split('?');
    const locales = shared.languages.map((l) => l.locale);
    const normalized = normalizePathForLanguageSwitch(pathname);
    const swapped =
      replaceLocaleInPath(normalized, targetLocale, locales) ??
      `/${targetLocale}/dashboard`;
    return search ? `${swapped}?${search}` : swapped;
  };

  const onLanguage = async (lang: string) => {
    const newLocale = sidebarLanguages.value.find((l) => l.language === lang)?.locale;
    if (!newLocale) return;
    if (newLocale === shared.locale) return;

    const newPath = newPathFromLocale(newLocale);
    router.get(newPath);
  };

  const isAdmin = computed(() => shared.user.isAdmin);

  const subscribed = (element: Subscription): boolean => {
    return shared.config.subscriptions.includes(element);
  };

  const locale = computed(() => {
    return shared.locale ?? 'en';
  });

  const goBack = () => {
    const pathname = (page.url ?? window.location.pathname).split('?')[0];
    const parent = parentPathForBack(pathname);
    if (parent) {
      router.get(parent);
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    router.get(`/${locale.value}/dashboard`);
  };

  const toggleMenu = () => {
    shared.setSidebarOpen(!shared.hasOpenSidebar);
  };

  const languageOptions = computed(() => sidebarLanguages.value.map((l) => l.language));

  const classList = (path: string, withGap: boolean = false) => {
    const url = window.location.href?.replace('/drop', '/stream') || '';

    return {
      'nav-link': true,
      active: url.includes(`/${locale.value}/${path}`),
      'flex items-center gap-x-3': withGap,
    };
  };

  const extractLocaleFromLink = (link: string): string => {
    const match = link.match(/^\/([a-z]{2})\//);
    return match ? match[1] : '';
  };

  return {
    shared,
    locale,
    isAdmin,
    sidebarLanguages,
    languageOptions,
    subscribed,
    classList,
    extractLocaleFromLink,
    goBack,
    toggleMenu,
    onLanguage,
  };
}
