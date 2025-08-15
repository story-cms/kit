import vine from '@vinejs/vine';

export const createPreferenceValidator = vine.compile(
  vine.object({
    settings: vine
      .object({
        bookmarks: vine
          .array(
            vine.object({
              label: vine.string().trim().minLength(1).maxLength(100),
              link: vine.string().trim().minLength(1).maxLength(500),
            }),
          )
          .optional(),
      })
      .optional(),
  }),
);

export const updatePreferenceValidator = vine.compile(
  vine.object({
    settings: vine
      .object({
        bookmarks: vine
          .array(
            vine.object({
              label: vine.string().trim().minLength(1).maxLength(100),
              link: vine.string().trim().minLength(1).maxLength(500),
            }),
          )
          .optional(),
      })
      .optional(),
  }),
);

export const bookmarkValidator = vine.compile(
  vine.object({
    label: vine.string().trim().minLength(1).maxLength(100),
    link: vine.string().trim().minLength(1).maxLength(500),
  }),
);
