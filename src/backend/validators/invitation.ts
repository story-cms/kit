import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import type { HttpContext } from '@adonisjs/core/http';
import type { SchemaTypes } from '@vinejs/vine/types';

const draft = {
  name: vine.string().optional(),
  window: vine.string().optional(),
  promoImage: vine.string().optional(),
  videoUrl: vine.string().optional(),
  title: vine.string().optional(),
  message: vine.string().optional(),
  actionLabel: vine.string().optional(),
  actionType: vine.enum(['close', 'donate', 'externalUrl']).optional(),
  actionUrl: vine.string().optional(),
  regions: vine.string().optional(),
  isPublished: vine.boolean(),
};

const live = {
  name: vine.string().trim().minLength(1),
  window: vine.string().trim().minLength(1),
  promoImage: vine.string().optional(),
  videoUrl: vine.string().optional(),
  title: vine.string().trim().minLength(1).maxLength(58),
  message: vine.string().trim().minLength(1).maxLength(560),
  actionLabel: vine.string().trim().minLength(1).maxLength(66),
  actionType: vine.enum(['close', 'donate', 'externalUrl']),
  actionUrl: vine.string().optional(),
  regions: vine.string().optional(),
  isPublished: vine.boolean(),
};

export class InvitationValidator {
  protected isPublished: boolean;
  protected isExternalUrl: boolean;
  protected hasVideoUrl: boolean;

  constructor(protected ctx: HttpContext) {
    this.isPublished = ctx.request.input('isPublished') === true;
    this.isExternalUrl = ctx.request.input('actionType') === 'externalUrl';
    const videoUrlInput = ctx.request.input('videoUrl');
    this.hasVideoUrl = typeof videoUrlInput === 'string' && videoUrlInput.trim() !== '';
  }

  public async validate(data: Record<string, unknown>): Promise<{ bundle: Record<string, unknown> }> {
    vine.messagesProvider = invitationErrorMessages;

    const schema = vine.object({
      bundle: this.effectiveSchema,
    });

    const result = await vine.validate({ schema, data: { bundle: data } });

    return {
      bundle: (result.bundle ?? {}) as Record<string, unknown>,
    };
  }

  protected get effectiveSchema(): SchemaTypes {
    if (!this.isPublished) return vine.object(draft);

    const liveSchema = {
      ...live,
      ...(this.isExternalUrl && {
        actionUrl: vine.string().url({
          require_protocol: true,
          protocols: ['http', 'https'],
        }),
      }),
      ...(this.hasVideoUrl && {
        videoUrl: vine
          .string()
          .url({
            require_protocol: true,
            protocols: ['https'],
          })
          .endsWith('.mp4'),
      }),
    };
    return vine.object(liveSchema);
  }

  // Kept for backwards compatibility with existing tests/usages.
  public get schema() {
    return vine.compile(this.effectiveSchema);
  }
}

export const invitationErrorMessages = new SimpleMessagesProvider({
  name: 'Name must be a string',
  window: 'Window must be a string',
  promoImage: 'Promo image must be a string',
  title: 'Title must be a string',
  message: 'Message must be a string',
  actionLabel: 'Action button must be a string',
  actionType: 'Action type must be a string',
  actionUrl: 'Action URL must be a valid URL',
  regions: 'Regions must be a string',
  'name.required': 'Give the invitation a short, descriptive name',
  'window.required': 'Specify the start and end dates',
  'title.required': 'An invitation title is required',
  'title.maxLength': 'Title cannot exceed 58 characters',
  'message.required': 'An invitation message is required',
  'message.maxLength': 'Message cannot exceed 560 characters',
  'actionLabel.required': 'A label for the action button is required',
  'actionLabel.maxLength': 'Action label cannot exceed 66 characters',
  'actionType.required': 'An action type is required',
  'actionUrl.required': 'An action URL is required',
  'actionUrl.url': 'The invitation needs a valid URL for the external action',
  'videoUrl.required': 'A video URL is required',
  'videoUrl.url': 'The invitation needs a valid URL for the video',
  'videoUrl.endsWith': 'The video URL must end with .mp4',
});
