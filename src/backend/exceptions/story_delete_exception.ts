import { Exception } from '@adonisjs/core/exceptions';

export default class StoryDeleteException extends Exception {
  static status = 500;
  static code = 'E_STORY_DELETE_BLOCKED';

  readonly messages: string[];

  constructor(messages: string[]) {
    super(messages.join('\n'));
    this.messages = messages;
  }

  public get reasons(): string {
    return this.messages.join(' | ');
  }
}
