import audioRule from '../validators/audio_rule.js';
import videoRule from '../validators/video_rule.js';
import { FieldSpec } from '@story-cms/kit';
import vine, {
  VineArray,
  VineBoolean,
  VineNumber,
  VineObject,
  VineString,
} from '@vinejs/vine';

type SchemaType =
  | VineString
  | VineNumber
  | VineBoolean
  | VineObject<
      Record<string, SchemaType>,
      Record<string, SchemaType>,
      Record<string, SchemaType>,
      Record<string, SchemaType>
    >
  | VineArray<
      VineObject<
        Record<string, SchemaType>,
        Record<string, SchemaType>,
        Record<string, SchemaType>,
        Record<string, SchemaType>
      >
    >;

export class BundleService {
  constructor(
    protected spec: FieldSpec[],
    protected isDraft: boolean = false,
  ) {}

  // ------------------------------------------------------------
  //  validation builder
  // ------------------------------------------------------------

  public getValidationBuilder = (isDraft: boolean) => {
    this.isDraft = isDraft;
    return this.validationObject(this.spec);
  };

  private validationObject = (specs: FieldSpec[]): Record<string, SchemaType> => {
    const builder = specs.reduce((carry, spec) => {
      const pairs = this.getValidationSchema(spec);
      return pairs.reduce((collectedPairs, pair) => {
        return {
          ...collectedPairs,
          ...pair,
        };
      }, carry);
    }, {});

    return builder;
  };

  private getValidationSchema = (spec: FieldSpec): Record<string, SchemaType>[] => {
    switch (spec.widget) {
      case 'panel': {
        const fields = spec.fields as FieldSpec[];
        return fields.map((field) => this.getSchemaPair(field));
      }

      default:
        return [this.getSchemaPair(spec)];
    }
  };

  private getSchemaPair = (spec: FieldSpec): Record<string, any> => {
    switch (spec.widget) {
      case 'object': {
        const fields = Object.values(spec.fields as object);
        return {
          [spec.name]: vine.object({
            ...this.validationObject(fields as FieldSpec[]),
          }),
        };
      }

      case 'list': {
        const objectPair = this.getSchemaPair({ ...spec, name: 'key', widget: 'object' });
        const objectSchema = objectPair['key'] as VineObject<
          Record<string, SchemaType>,
          Record<string, SchemaType>,
          Record<string, SchemaType>,
          Record<string, SchemaType>
        >;
        return {
          [spec.name]: vine.array(objectSchema),
        };
      }
      case 'boolean':
        return {
          [spec.name]: this.isDraft ? vine.boolean().nullable() : vine.boolean(),
        };
      case 'scripture':
        return {
          [spec.name]: this.isDraft ? this.scriptureDraftSchema : this.scriptureSchema,
        };
      case 'number':
        return {
          [spec.name]: this.isDraft ? vine.number().nullable() : vine.number(),
        };
      case 'audio':
        return {
          [spec.name]: this.isDraft ? this.audioDraftSchema : this.audioSchema,
        };
      case 'video':
        return {
          [spec.name]: this.isDraft ? this.videoDraftSchema : this.videoSchema,
        };
      case 'image':
      case 'animation':
        return {
          [spec.name]: this.isDraft
            ? vine.string().nullable()
            : vine.string().trim().url(),
        };
      default:
        // case 'select':
        // case 'markdown':
        // case 'string':
        return {
          [spec.name]: this.isDraft
            ? vine.string().trim().nullable()
            : vine.string().trim(),
        };
    }
  };

  private scriptureSchema = vine.object({
    reference: vine.string(),
    verse: vine.string(),
  });

  private scriptureDraftSchema = vine.object({
    reference: vine.string().nullable(),
    verse: vine.string().nullable(),
  });

  private audioDraftSchema = vine.object({
    url: vine.string().nullable(),
    length: vine.number().nullable(),
  });

  private audioSchema = vine
    .object({
      url: vine.string(),
      length: vine.number(),
    })
    .use(audioRule(null));

  private videoDraftSchema = vine.object({
    url: vine.string().nullable(),
  });

  private videoSchema = vine
    .object({
      url: vine.string(),
    })
    .use(videoRule(null));

  // ------------------------------------------------------------
  //  bundle updater
  // ------------------------------------------------------------

  public updatedBundle = (old: Record<string, unknown>, changes: any): string => {
    const fallback = JSON.parse(this.defaultBundle);
    const fresh = Object.entries(fallback).reduce(
      (acc, [key, value]) => {
        acc[key] = this.freshValue(old, changes, key, value);
        return acc;
      },
      {} as Record<string, any>,
    );

    return JSON.stringify(fresh);
  };

  // used for updating an existing bundle
  private freshValue(
    old: Record<string, any>,
    changes: Record<string, any>,
    key: string,
    fallback: any,
  ): any {
    if (changes[key] !== undefined) return changes[key];
    if (old[key] !== undefined) return old[key];
    return fallback;
  }

  // ------------------------------------------------------------
  //  bundle builder
  // ------------------------------------------------------------

  public get defaultBundle(): string {
    const shapes = this.getBundleShapes(this.spec);
    return `{ ${shapes} }`;
  }

  private getBundleShapes(spec: object[]): string {
    return (
      spec
        // .filter((widget) => widget.hasOwnProperty('name'))
        .map((node) => {
          return this.renderBundleShape(node);
        })
        .join(',')
    );
  }

  private renderBundleShape(node: any): string {
    if (node['widget'] === 'panel' && node['fields'])
      return this.getBundleShapes(node['fields']);

    if (node['widget'] === 'list' && node['fields']) return `"${node.name}":[]`;
    if (node['widget'] === 'string') return `"${node.name}": ""`;
    if (node['widget'] === 'image') return `"${node.name}": ""`;
    if (node['widget'] === 'object') {
      const branch = this.renderObjectShape(node['fields']);
      return `"${node.name}": ${branch}`;
    }

    return `"${node.name}": ""`;
  }

  private renderObjectShape(node: any): string {
    const items = Object.entries(node)
      .map(([, value]) => {
        return this.renderBundleShape(value);
      })
      .join(',');

    return `{ ${items} }`;
  }
}
