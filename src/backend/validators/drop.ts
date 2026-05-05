import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import { SchemaTypes } from '@vinejs/vine/types';
import type { FieldSpec } from '../../types';
import { BundleService } from '../services/bundle_service.js';

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
  title: vine.string().trim().minLength(1),
  coverImage: vine.string(),
  releaseAt: vine.date({
    formats: ['iso8601'],
  }),
  isPublished: vine.boolean(),
};

export default class DropValidator {
  constructor(
    protected isPublished: boolean,
    protected bundleSpec: FieldSpec[],
  ) {}
  validate(data: any): Promise<any> {
    vine.messagesProvider = new SimpleMessagesProvider({
      'bundle.title.minLength': 'A post must have a title',
      'bundle.coverImage.required': 'A post must have a cover image',
      'bundle.releaseAt.required': 'A post must have a release date',
      'bundle.isPublished.required': 'A post must be published or not',
    });

    const schema = vine.object({
      bundle: this.effectiveSchema,
    });

    return vine.validate({ schema, data: { bundle: data } });
  }

  protected get effectiveSchema(): SchemaTypes {
    const service = new BundleService(this.bundleSpec);
    const bundle = service.getValidationBuilder(!this.isPublished);
    const schema = {
      ...(this.isPublished ? live : draft),
      ...bundle,
    };
    return vine.object(schema);
  }
}
