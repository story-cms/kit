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
  title: vine.string(),
  message: vine.string(),
  actionLabel: vine.string(),
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
  'name.required': 'A name is required',
  'window.required': 'A window is required',
  'title.required': 'A title is required',
  'message.required': 'A message is required',
  'actionLabel.required': 'An action button is required',
  'actionType.required': 'An action type is required',
  'actionUrl.required': 'An action URL is required',
});
