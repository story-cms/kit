import vine, { SimpleMessagesProvider } from '@vinejs/vine';

vine.messagesProvider = new SimpleMessagesProvider({
  'email.required': 'This field is required.',
  'email.email': 'Enter a valid email address.',
  'password.confirmed': 'Those two passwords are not the same.',
});

/**
 * Validates the reset password request
 */
export const requestPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
  }),
);

/**
 * Validates the new password
 */
export const newPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6).confirmed({
      confirmationField: 'confirmPassword',
    }),
  }),
);
