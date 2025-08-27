import User from '../models/user.js';
import db from '@adonisjs/lucid/services/db';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';

vine.messagesProvider = new SimpleMessagesProvider({
  'name.required': 'This field is required',
  'email.required': 'This field is required',
  'email.unique': 'That email is already used.',
  'email.email': 'Enter a valid email address.',
});

async function unique(value: unknown, options: Options, field: FieldContext) {
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

/**
 * Converting a function to a VineJS rule
 */
export const uniqueRule = vine.createRule(unique);

/**
 * Validates the user's creation action
 */
export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine
      .string()
      .trim()
      .email()
      .use(uniqueRule({ table: 'users', column: 'email' })),
    language: vine.string(),
    role: vine.enum(User.roles),
  }),
);

/**
 * Validates the user's update action
 */
export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().trim().email(),
    language: vine.string(),
    role: vine.enum(User.roles),
  }),
);

/**
 * Options accepted by the unique rule
 */
type Options = {
  table: string;
  column: string;
};
