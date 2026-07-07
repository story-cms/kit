<template>
  <Story title="Ui Page" group="interface">
    <Variant title="Index" :setup-app="miniSidebar">
      <UiPage v-bind="pageProps" :items="indexItems" />
    </Variant>

    <Variant title="Inbox zero" :setup-app="miniSidebar">
      <UiPage v-bind="pageProps" :items="inboxZeroItems" />
    </Variant>

    <Variant title="All to do" :setup-app="miniSidebar">
      <UiPage v-bind="pageProps" :items="allTodoItems" />
    </Variant>

    <Variant title="Flagged for review" :setup-app="miniSidebar">
      <UiPage v-bind="pageProps" :items="flaggedItems" />
    </Variant>

    <Variant title="With edit dates" :setup-app="miniSidebar">
      <UiPage v-bind="pageProps" :items="datedItems" />
    </Variant>

    <Variant title="RTL" :setup-app="miniSidebar">
      <UiPage v-bind="pageProps" :items="rtlItems" :language="arabic" />
    </Variant>

    <Variant title="AI suggestion" :setup-app="setupAiSuggestion">
      <UiPage
        v-bind="pageProps"
        :items="suggestionItems"
        initial-suggestion="¡Hola y bienvenido!"
      />
    </Variant>

    <Variant title="AI suggestion loading" :setup-app="setupAiSuggestion">
      <UiPage
        v-bind="pageProps"
        :items="suggestionItems"
        :initial-suggestion-loading="true"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import axios from 'axios';
import UiPage from './ui-page.vue';
import { sharedProps, miniSidebar } from '../test/mocks';
import type { LanguageSpecification, UiItem } from '../../types';
import type { StoryHandler } from '../shared/helpers';

const mockUiApi: StoryHandler = ({ app, story, variant }) => {
  miniSidebar({ app, story, variant });
  axios.post = ((url: string) => {
    if (url.includes('/ui/suggest')) {
      return Promise.resolve({ status: 200, data: { suggestion: '¡Hola y bienvenido!' } });
    }
    return Promise.resolve({ status: 200, data: {} });
  }) as typeof axios.post;
};

const setupAiSuggestion: StoryHandler = (context) => {
  mockUiApi(context);
};

const pageProps = {
  config: sharedProps.config,
  user: sharedProps.user,
  language: sharedProps.language,
  errors: { onBoardTitle: 'This is an error' },
  bookmarks: sharedProps.bookmarks,
};

const arabic: LanguageSpecification = {
  locale: 'ar',
  language: 'Arabic - عربى',
  languageDirection: 'rtl',
};

const indexItems: UiItem[] = [
  {
    key: 'welcomeTitle',
    source: 'Hello and Welcome!',
    translation: 'Hola y Bienvenido!',
    description: 'The main welcome message',
    flag: 'recheck',
  },
  {
    key: 'welcomeSubtitle',
    source: 'Let’s begin your journey',
    translation: 'Comencemos tu viaje',
    description: 'Subtitle for the welcome screen',
  },
  {
    key: 'introMessage',
    source: 'Discover amazing features in this app.',
    translation: 'Descubre funciones increíbles en esta aplicación.',
    description: 'Introduction message for new users',
    flag: 'prefilled',
  },
  {
    key: 'featureHighlight1',
    source: 'Track your progress easily',
    translation: 'Sigue tu progreso fácilmente',
    description: 'Highlight of a key feature',
  },
  {
    key: 'featureHighlight2',
    source: 'Stay connected with your friends',
    translation: 'Mantente conectado con tus amigos',
    description: 'Highlight of a social feature',
  },
  {
    key: 'featureHighlight3',
    source: 'Customize your experience',
    translation: '',
    description: 'Highlight of customization options',
  },
  {
    key: 'featureHighlight4',
    source: 'Access your data anywhere',
    translation: 'Accede a tus datos en cualquier lugar',
    description: 'Highlight of accessibility feature',
  },
  {
    key: 'actionPrompt',
    source: 'Start Exploring Now!',
    translation: '¡Empieza a explorar ahora!',
    description: 'Encouragement for users to engage',
  },
  {
    key: 'confirmationMessage',
    source: 'Are you sure you want to continue?',
    translation: '¿Estás seguro de que quieres continuar?',
    description: 'Confirmation prompt for user actions',
  },
  {
    key: 'profileCompletion',
    source: 'Complete your profile for a better experience.',
    translation: '',
    description: 'Encouragement to complete user profile',
  },
  {
    key: 'reminderMessage',
    source: 'Don’t forget to check your daily tasks!',
    translation: '',
    description: 'Reminder notification for users',
  },
  {
    key: 'exitMessage',
    source: 'Goodbye! See you soon.',
    translation: '',
    description: 'Message displayed when the user exits',
  },
  {
    key: 'onBoardCTA',
    source: 'Get Started',
    translation: 'Comenzar',
    description: 'Call-to-action button text',
  },
  {
    key: 'errorMessage',
    source: 'Something went wrong. Please try again.',
    translation: 'Algo salió mal. Por favor, inténtalo de nuevo.',
    description: 'Error message displayed on failures',
  },
  {
    key: 'successMessage',
    source: 'Your action was successful!',
    translation: '¡Tu acción fue exitosa!',
    description: 'Message displayed after a successful action',
  },
  {
    key: 'loadingMessage',
    source: 'Loading, please wait...',
    translation: 'Cargando, por favor espera...',
    description: 'Displayed while content is loading',
  },
  {
    key: 'updatePrompt',
    source: 'A new update is available. Update now?',
    translation: 'Hay una nueva actualización disponible. ¿Actualizar ahora?',
    description: 'Prompt for users to update the app',
  },
  {
    key: 'notificationTitle',
    source: 'You have new notifications!',
    translation: '¡Tienes nuevas notificaciones!',
    description: 'Title for notification alerts',
  },
  {
    key: 'helpSupport',
    source: 'Need help? Contact support.',
    translation: '¿Necesitas ayuda? Contacta con soporte.',
    description: 'Message directing users to support',
  },
  {
    key: 'termsAgreement',
    source: 'By continuing, you agree to our Terms and Conditions.',
    translation: '',
    description: 'Agreement message before proceeding',
  },
];

const inboxZeroItems: UiItem[] = [
  {
    key: 'welcomeTitle',
    source: 'Hello and Welcome!',
    translation: 'Hola y Bienvenido!',
    description: 'The main welcome message',
  },
  {
    key: 'welcomeSubtitle',
    source: 'Let’s begin your journey',
    translation: 'Comencemos tu viaje',
    description: 'Subtitle for the welcome screen',
  },
  {
    key: 'introMessage',
    source: 'Discover amazing features in this app.',
    translation: 'Descubre funciones increíbles en esta aplicación.',
    description: 'Introduction message for new users',
  },
  {
    key: 'actionPrompt',
    source: 'Start Exploring Now!',
    translation: '¡Empieza a explorar ahora!',
    description: 'Encouragement for users to engage',
  },
];

const allTodoItems: UiItem[] = [
  {
    key: 'welcomeTitle',
    source: 'Hello and Welcome!',
    translation: '',
    description: 'The main welcome message',
  },
  {
    key: 'welcomeSubtitle',
    source: 'Let’s begin your journey',
    translation: '',
    description: 'Subtitle for the welcome screen',
  },
  {
    key: 'introMessage',
    source: 'Discover amazing features in this app.',
    translation: '',
    description: 'Introduction message for new users',
  },
  {
    key: 'actionPrompt',
    source: 'Start Exploring Now!',
    translation: '',
    description: 'Encouragement for users to engage',
  },
  {
    key: 'exitMessage',
    source: 'Goodbye! See you soon.',
    translation: '',
    description: 'Message displayed when the user exits',
  },
];

const flaggedItems: UiItem[] = [
  {
    key: 'welcomeTitle',
    source: 'Hello and Welcome!',
    translation: 'Hola y Bienvenido!',
    description: 'The main welcome message',
    flag: 'recheck',
  },
  {
    key: 'introMessage',
    source: 'Discover amazing features in this app.',
    translation: 'Descubre funciones increíbles en esta aplicación.',
    description: 'Introduction message for new users',
    flag: 'prefilled',
  },
  {
    key: 'actionPrompt',
    source: 'Start Exploring Now!',
    translation: '¡Empieza a explorar ahora!',
    description: 'Encouragement for users to engage',
    flag: 'recheck',
  },
  {
    key: 'successMessage',
    source: 'Your action was successful!',
    translation: '¡Tu acción fue exitosa!',
    description: 'Message displayed after a successful action',
  },
];

const datedItems: UiItem[] = [
  {
    key: 'recentEdit',
    source: 'Recently edited string',
    translation: 'Cadena editada recientemente',
    description: 'Updated a few minutes ago',
    updatedAt: '2026-07-07T10:00:00.000Z',
  },
  {
    key: 'olderEdit',
    source: 'Edited last week',
    translation: 'Editado la semana pasada',
    description: 'Updated several days ago',
    updatedAt: '2026-06-30T08:30:00.000Z',
  },
  {
    key: 'oldestEdit',
    source: 'Edited long ago',
    translation: 'Editado hace mucho tiempo',
    description: 'Updated months ago',
    updatedAt: '2026-01-15T14:00:00.000Z',
  },
  {
    key: 'noTimestamp',
    source: 'Never saved',
    translation: '',
    description: 'Missing translation with no edit date',
  },
  {
    key: 'flaggedRecent',
    source: 'Flagged after review',
    translation: 'Marcado después de revisión',
    description: 'Recently flagged for recheck',
    flag: 'recheck',
    updatedAt: '2026-07-07T09:45:00.000Z',
  },
];

const rtlItems: UiItem[] = [
  {
    key: 'welcomeTitle',
    source: 'Hello and Welcome!',
    translation: 'مرحبًا وأهلاً بك!',
    description: 'The main welcome message',
  },
  {
    key: 'introMessage',
    source: 'Discover amazing features in this app.',
    translation: '',
    description: 'Introduction message for new users',
  },
  {
    key: 'actionPrompt',
    source: 'Start Exploring Now!',
    translation: 'ابدأ الاستكشاف الآن!',
    description: 'Encouragement for users to engage',
    flag: 'prefilled',
  },
  {
    key: 'exitMessage',
    source: 'Goodbye! See you soon.',
    translation: '',
    description: 'Message displayed when the user exits',
  },
];

const suggestionItems: UiItem[] = [
  {
    key: 'welcomeTitle',
    source: 'Hello and Welcome!',
    translation: 'Hola y Bie',
    description: 'The main welcome message',
  },
];
</script>
