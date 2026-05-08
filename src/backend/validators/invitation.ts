import type { HttpContext } from '@adonisjs/core/http';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import type { SchemaTypes } from '@vinejs/vine/types';

const draft = {
  name: vine.string().trim().minLength(1),
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

  validate(data: any): Promise<any> {
    vine.messagesProvider = invitationErrorMessages;

    const schema = vine.object({
      bundle: this.effectiveSchema,
    });

    return vine.validate({ schema, data: { bundle: data } });
  }

  protected get effectiveSchema(): SchemaTypes {
    if (!this.isPublished) {
      return vine.object(draft);
    }

    if (this.isExternalUrl) {
      const liveWithUrl = {
        ...live,
        actionUrl: vine.string().url({
          require_protocol: true,
          protocols: ['http', 'https'],
        }),
      };
      if (this.hasVideoUrl) {
        return vine.object({
          ...liveWithUrl,
          videoUrl: vine
            .string()
            .url({
              require_protocol: true,
              protocols: ['https'],
            })
            .endsWith('.mp4'),
        });
      }
      return vine.object(liveWithUrl);
    }

    if (this.hasVideoUrl) {
      const liveWithVideo = {
        ...live,
        videoUrl: vine
          .string()
          .url({
            require_protocol: true,
            protocols: ['https'],
          })
          .endsWith('.mp4'),
      };
      return vine.object(liveWithVideo);
    }

    return vine.object(live);
  }

  // Kept for backwards compatibility with existing tests/usages.
  public get schema() {
    return vine.compile(this.effectiveSchema);
  }
}

export const invitationErrorMessages = new SimpleMessagesProvider({
  'bundle.name': 'Name must be a string',
  'bundle.window': 'Window must be a string',
  'bundle.promoImage': 'Promo image must be a string',
  'bundle.title': 'Title must be a string',
  'bundle.message': 'Message must be a string',
  'bundle.actionLabel': 'Action button must be a string',
  'bundle.actionType': 'Action type must be a string',
  'bundle.actionUrl': 'Action URL must be a valid URL',
  'bundle.regions': 'Regions must be a string',
  'bundle.name.required': 'Give the invitation a short, descriptive name',
  'bundle.name.minLength': 'Give the invitation a short, descriptive name',
  'bundle.window.minLength': 'Specify the start and end dates',
  'bundle.title.minLength': 'An invitation title is required',
  'bundle.title.maxLength': 'Title cannot exceed 58 characters',
  'bundle.message.minLength': 'An invitation message is required',
  'bundle.message.maxLength': 'Message cannot exceed 560 characters',
  'bundle.actionLabel.minLength': 'A label for the action button is required',
  'bundle.actionLabel.maxLength': 'Action label cannot exceed 66 characters',
  'bundle.actionType.required': 'An action type is required',
  'bundle.actionUrl.required': 'An action URL is required',
  'bundle.actionUrl.url': 'The invitation needs a valid URL for the external action',
  'bundle.videoUrl.required': 'A video URL is required',
  'bundle.videoUrl.url': 'The invitation needs a valid URL for the video',
  'bundle.videoUrl.endsWith': 'The video URL must end with .mp4',
});
