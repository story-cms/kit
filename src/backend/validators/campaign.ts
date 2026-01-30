import vine, { SimpleMessagesProvider, VineValidator } from '@vinejs/vine';
import type { HttpContext } from '@adonisjs/core/http';

const draft = {
  name: vine.string().optional(),
  window: vine.string().optional(),
  promoImage: vine.string().optional(),
  title: vine.string().optional(),
  message: vine.string().optional(),
  actionLabel: vine.string().optional(),
  actionType: vine.enum(['close', 'donate', 'externalUrl']).optional(),
  actionUrl: vine.string().optional(),
  regions: vine.string().optional(),
  isPublished: vine.boolean(),
};

const live = {
  name: vine.string(),
  window: vine.string(),
  promoImage: vine.string().optional(),
  title: vine.string().maxLength(58),
  message: vine.string().maxLength(560),
  actionLabel: vine.string().maxLength(66),
  actionType: vine.enum(['close', 'donate', 'externalUrl']),
  actionUrl: vine.string().optional(),
  regions: vine.string().optional(),
  isPublished: vine.boolean(),
};

export class CampaignValidator {
  protected isPublished: boolean;
  protected isExternalUrl: boolean;

  constructor(protected ctx: HttpContext) {
    this.isPublished = ctx.request.input('isPublished') === true;
    this.isExternalUrl = ctx.request.input('actionType') === 'externalUrl';
  }

  public get schema(): VineValidator<any, Record<string, any> | undefined> {
    if (!this.isPublished) {
      return vine.compile(vine.object(draft));
    }
    if (this.isExternalUrl) {
      const liveExternalUrlSchema = {
        ...live,
        actionUrl: vine.string().url({
          require_protocol: true,
          protocols: ['http', 'https'],
        }),
      };
      return vine.compile(vine.object(liveExternalUrlSchema));
    }
    return vine.compile(vine.object(live));
  }
}

export const campaignErrorMessages = new SimpleMessagesProvider({
  name: 'Name must be a string',
  window: 'Window must be a string',
  promoImage: 'Promo image must be a string',
  title: 'Title must be a string',
  message: 'Message must be a string',
  actionLabel: 'Action button must be a string',
  actionType: 'Action type must be a string',
  actionUrl: 'Action URL must be a valid URL',
  regions: 'Regions must be a string',
  'name.required': 'Give the campaign a short, descriptive name',
  'window.required': 'Specify the start and end dates',
  'title.required': 'A campaign title is required',
  'title.maxLength': 'Title cannot exceed 58 characters',
  'message.required': 'A campaign message is required',
  'message.maxLength': 'Message cannot exceed 560 characters',
  'actionLabel.required': 'A label for the action button is required',
  'actionLabel.maxLength': 'Action label cannot exceed 66 characters',
  'actionType.required': 'An action type is required',
  'actionUrl.required': 'An action URL is required',
  'actionUrl.url': 'The campaign needs a valid URL for the external action',
});
