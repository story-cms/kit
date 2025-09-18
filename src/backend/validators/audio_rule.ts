import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';
import { Audio } from '@story-cms/kit';

type Options = {
  canBeEmpty: boolean;
};

/**
 * Implementation
 */
function audio(
  value: unknown,
  options: Options = { canBeEmpty: false },
  field: FieldContext,
) {
  if (!hasCorrectShape(value)) {
    field.report('Please upload a valid file', 'audio', field);
    return;
  }

  const subject = value as Audio;

  if (options.canBeEmpty && isEmptyShape(subject)) return;

  if (!isValidAudio(subject)) {
    field.report('Please upload a valid file', 'audio', field);
  }
}

const hasCorrectShape = (value: unknown): boolean => {
  // is the value an object
  if (typeof value !== 'object') return false;

  // does the object have the required keys
  const valueObject = value as any;
  if (valueObject['url'] === undefined) return false;
  if (valueObject['length'] === undefined) return false;

  return true;
};

const isEmptyShape = (value: Audio): boolean => {
  if (value['url'] === null && value['length'] === null) return true;
  return false;
};

const isValidAudio = (value: Audio) => {
  if (value['url'] === null || value['length'] === null) return false;

  value['length'] = Number(value['length']);

  if (typeof value['url'] !== 'string' || typeof value['length'] !== 'number')
    return false;

  return value.url.toLowerCase().endsWith('.mp3') && value.length > 0;
};

/**
 * Converting a function to a VineJS rule
 */
export default vine.createRule(audio);
