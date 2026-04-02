import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator';

export default {
  types: {
    jsonb: {
      decorator: '@column()',
      tsType: 'JSON<any>',
      imports: [
        {
          source: '#types/db',
          typeImports: ['JSON'],
        },
      ],
    },
  },
  tables: {
    users: {
      columns: {
        role: {
          decorator: '@column()',
          tsType: `'admin' | 'editor'`,
        },
      },
    },
    indices: {
      columns: {
        items: {
          decorator: '@column()',
          tsType: 'IndexItems',
          imports: [
            {
              source: '@tory-cms/kit',
              typeImports: ['IndexItems'],
            },
          ],
        },
        published_list: {
          decorator: '@column()',
          tsType: 'Array<number>',
        },
        drafts_list: {
          decorator: '@column()',
          tsType: 'Array<number>',
        },
        issues_list: {
          decorator: '@column()',
          tsType: 'Array<number>',
        },
      },
    },
  },
} satisfies SchemaRules;
