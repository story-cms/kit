<template>
  <Story title="Ui Page" group="interface">
    <Variant title="Index">
      <UiPage
        :items="items"
        :errors="{ onBoardTitle: 'This is an error' }"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :stories="['John', 'Acts']"
        :ui-todo-count="sharedProps.uiTodoCount"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import UiPage from './ui-page.vue';
import { sharedProps } from '../test/mocks';

const items = [
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
</script>
