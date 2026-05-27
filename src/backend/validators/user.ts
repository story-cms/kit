import db from '@adonisjs/lucid/services/db';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';

vine.messagesProvider = new SimpleMessagesProvider({
  'name.minLength': 'This field is required',
  'email.required': 'This field is required',
  'email.unique': 'That email is already used.',
  'email.email': 'Enter a valid email address.',
  'language.minLength': 'This field is required',
  'role.enum': 'Invalid role.',
});

type UniqueOptions = {
  table: string;
  column: string;
};

async function unique(value: unknown, options: UniqueOptions, field: FieldContext) {
  /**
   * We do not want to deal with non-string
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return;
  }

  const row = await db
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .first();

  if (row) {
    field.report('The {{ field }} field is not unique', 'unique', field);
  }
}

async function uniqueExceptSelf(
  value: unknown,
  options: UniqueOptions,
  field: FieldContext,
) {
  if (typeof value !== 'string') {
    return;
  }

  const userId = field.meta.userId as number;

  const row = await db
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .whereNot('id', userId)
    .first();

  if (row) {
    field.report('The {{ field }} field is not unique', 'unique', field);
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const uniqueRule = vine.createRule(unique);
export const uniqueExceptSelfRule = vine.createRule(uniqueExceptSelf);

const roles = ['admin', 'editor'];

/**
 * Validates the user's creation action
 */
export const createUserValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(1),
    email: vine
      .string()
      .trim()
      .email()
      .use(uniqueRule({ table: 'users', column: 'email' })),
    language: vine.string().trim().minLength(1),
    role: vine.enum(roles),
  }),
);

/**
 * Validates the user's update action
 */
export const updateUserValidator = vine.withMetaData<{ userId: number }>().create(
  vine.object({
    name: vine.string().trim().minLength(1),
    email: vine
      .string()
      .trim()
      .email()
      .use(uniqueExceptSelfRule({ table: 'users', column: 'email' })),
    language: vine.string().trim().minLength(1),
    role: vine.enum(roles),
  }),
);
