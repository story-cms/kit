import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';
import { Audio } from '@story-cms/kit';

/**
 * Implementation
 */
function audio(value: unknown, _options: null, field: FieldContext) {
  const notValid = !isValidAudio(value);

  if (notValid) {
    field.report('Please upload a valid file', 'audio', field);
  }
}

const isValidAudio = (value: unknown) => {
  if (typeof value !== 'object') return false;

  const subject = value as Audio;
  if (!subject['url'] || !subject['length']) return false;

  subject['length'] = Number(subject['length']);

  if (typeof subject['url'] !== 'string' || typeof subject['length'] !== 'number')
    return false;

  return subject.url.endsWith('.mp3') && subject.length > 0;
};

/**
 * Converting a function to a VineJS rule
 */
export default vine.createRule(audio);
