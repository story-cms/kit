import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';
import { Video } from '@story-cms/kit';

/**
 * Implementation
 */
function video(value: unknown, _options: null, field: FieldContext) {
  const notValid = !isValidVideo(value);

  if (notValid) {
    field.report('Please upload a valid file', 'video', field);
  }
}

const isValidVideo = (value: unknown) => {
  if (typeof value !== 'object') return false;

  const subject = value as Video;
  if (!subject['url']) return false;

  if (typeof subject['url'] !== 'string') return false;

  return subject.url.endsWith('.mp4');
};

/**
 * Converting a function to a VineJS rule
 */
export default vine.createRule(video);
