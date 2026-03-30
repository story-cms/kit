import vine from '@vinejs/vine';

export const supportCodes = ['REMOVE_LANGUAGE'] as const;
export type SupportCode = (typeof supportCodes)[number];

export const supportRequestValidator = vine.compile(
  vine.object({
    supportCode: vine.enum(supportCodes),
    context: vine.object({}).allowUnknownProperties(),
  }),
);
