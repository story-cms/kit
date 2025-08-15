import { BundleService } from '../services/bundle_service.js';
import { FieldSpec } from '@story-cms/kit';
import vine, { SimpleMessagesProvider, VineValidator } from '@vinejs/vine';

const draft = {
  title: vine.string(),
  isPublished: vine.boolean(),
  coverImage: vine.string().optional(),
  releaseAt: vine
    .date({
      formats: ['iso8601'],
    })
    .nullable(),
};

const live = {
  title: vine.string(),
  coverImage: vine.string(),
  releaseAt: vine.date({
    formats: ['iso8601'],
  }),
  isPublished: vine.boolean(),
};

export class DropValidator {
  constructor(
    protected isPublished: boolean,
    protected bundleSpec: FieldSpec[],
  ) {}

  public get schema(): VineValidator<any, Record<string, any> | undefined> {
    const service = new BundleService(this.bundleSpec);
    const bundle = service.getValidationBuilder(!this.isPublished);
    const schema = {
      ...(this.isPublished ? live : draft),
      ...bundle,
    };
    return vine.compile(vine.object(schema));
  }
}

export const errorMessages = new SimpleMessagesProvider({
  title: 'Title must be a string',
  description: 'Description must be a string',
  'title.required': 'A title is required',
  'description.required': 'A description is required',
});
