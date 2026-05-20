import { BaseTransformer } from '@adonisjs/core/transformers';
import Story from '../models/story';

export class StoryTransformer extends BaseTransformer<Story> {
  toObject() {
    return this.omit(this.resource, ['order', 'localisations']);
  }
}
