import vine, { SimpleMessagesProvider } from '@vinejs/vine';

export const draftValidator = vine.compile(
  vine.object({
    bundle: vine.object({
      title: vine.string(),
    }),
  }),
);

export const bundleErrorMessages = new SimpleMessagesProvider({
  'bundle.title': 'Title must be a string',
  'bundle.title.required': 'A title is required',
});
