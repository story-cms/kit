import type {
  FieldSpec,
  LanguageSpecification,
  CmsMeta,
  SharedPageProps,
  StorySpec,
} from '../../types.ts';
import { StoryHandler } from '../shared/helpers.js';
import { useSharedStore } from '../store/shared.js';

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  favoriteScripture: {
    reference: string;
    verse: string;
  };
}

interface ObjectModel {
  name: string;
  age: number | null;
  notes: string;
  profile: string;
  address: Address;
}

export const objectModel: ObjectModel = {
  name: 'John',
  age: 30,
  notes: '# The Outing\nWe went to the park at *09h00* on a **sunny** day.',
  profile:
    'https://res.cloudinary.com/onesheep/image/upload/v1669793982/cld-sample-2.jpg',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    favoriteScripture: {
      reference: 'John 3:16',
      verse:
        '`16` For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    },
  },
};

export const objectModelReadonly: ObjectModel = {
  ...objectModel,
  address: {
    street: '567 Main St',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89123',
    favoriteScripture: {
      reference: 'Matthew 3:16',
      verse:
        '`16` As soon as Jesus was baptized, he went up out of the water. At that moment heaven was opened, and he saw the Spirit of God descending like a dove and alighting on him.',
    },
  },
};

export const emptyModel: ObjectModel = {
  name: '',
  age: null,
  notes: '',
  profile: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
    favoriteScripture: {
      reference: '',
      verse: '',
    },
  },
};

export const objectModelBlankImage = {
  name: 'John',
  age: 30,
  notes: '# The Outing\nWe went to the park at *09h00* on a **sunny** day.',
  profile: '',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    favoriteScripture: {
      reference: 'John 3:16',
      verse:
        '`16` For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    },
  },
};

export const objectSpec = {
  name: 'address',
  label: '',
  widget: 'object',
  fields: [
    {
      name: 'street',
      label: 'Street',
      widget: 'string',
    },
    {
      name: 'city',
      label: 'City',
      widget: 'string',
    },
    {
      name: 'zip',
      label: 'Zip',
      widget: 'string',
    },
    {
      name: 'favoriteScripture',
      label: 'Favorite Scripture',
      widget: 'scripture',
    },
  ],
};

export const objectErrors = {
  'bundle.name': ['required validation failed'],
  'bundle.notes': ['required validation failed'],
  'bundle.profile': ['required validation failed'],
  'bundle.address.zip': ['required validation failed'],
  'bundle.address.favoriteScripture': ['required validation failed'],
  'bundle.releasedAt': ['required validation failed'],
  'bundle.tags': ['required validation failed'],
};

export const listInObjectSpec: FieldSpec = {
  name: 'spread',
  label: 'Spread',
  widget: 'object',
  fields: [
    {
      name: 'scriptureReference',
      label: 'Scripture Reference',
      widget: 'string',
    },
    {
      name: 'releasedAt',
      label: 'Released At',
      widget: 'date',
    },
    {
      label: 'Notes',
      name: 'notes',
      widget: 'list',
      fields: [
        {
          label: 'Frame type',
          name: 'type',
          widget: 'string',
        },
        {
          label: 'Frame content',
          name: 'content',
          widget: 'markdown',
        },
        {
          name: 'releasedAt',
          label: 'Released At',
          widget: 'date',
        },
      ],
    },
  ],
};

export const listInObjectModel = {
  spread: {
    scriptureReference: 'John 1:1',
    notes: [
      { type: 'definition', content: '`grace` is a noun.' },
      {
        type: 'comment',
        content: 'paragraph **1**\nparagraph **2**\nparagraph **3**',
      },
    ],
  },
};

export const listInObjectError = {
  'bundle.spread.notes.0.content': ['required validation failed'],
};

export const listSpec = {
  label: 'Section',
  name: 'sections',
  widget: 'list',
  index: 'scripture.reference',
  fields: [
    {
      label: 'Scripture',
      name: 'scripture',
      widget: 'scripture',
    },
    {
      label: 'Commentary',
      name: 'commentary',
      widget: 'markdown',
    },
  ],
};

export const listModel = {
  sections: [
    {
      scripture: {
        reference: 'John 1:1',
        verse:
          '`1` In the beginning was the Word, and the Word was with God, and the Word was God.',
      },
      commentary:
        'In the beginning was the **Word**, and the Word was with God, and the Word was God.',
    },
    {
      scripture: {
        reference: 'John 1:2',
        verse: '`2` He was with God in the beginning.',
      },
      commentary: 'He was with God in the beginning.',
    },
  ],
};

export const listInListSpec: FieldSpec = {
  label: 'Spread',
  name: 'spreads',
  widget: 'list',
  canFold: true,
  fields: [
    {
      label: 'Title',
      name: 'title',
      widget: 'string',
    },
    {
      label: 'Notes',
      name: 'notes',
      widget: 'list',
      fields: [
        {
          label: 'Frame type',
          name: 'type',
          widget: 'select',
          options: [
            { label: 'Definition', value: 'definition' },
            { label: 'Comment', value: 'comment' },
          ],
          default: 'definition',
        },
        {
          label: 'Frame content',
          name: 'content',
          widget: 'markdown',
        },
      ],
    },
  ],
};

export const listInListModel = {
  spreads: [
    {
      title: 'Spread 1',
      notes: [
        { type: 'definition', content: '`grace` is a noun.' },
        {
          type: 'comment',
          content: 'paragraph **1**\nparagraph **2**\nparagraph **3**',
        },
      ],
    },
    {
      title: 'Spread 2',
      notes: [
        { type: 'definition', content: '`love`' },
        {
          type: 'comment',
          content: 'paragraph **1**\nparagraph **2**\nparagraph **3**\nparagraph **4**',
        },
      ],
    },
  ],
};

export const listInListErrors = {
  'bundle.spreads.0.notes.1.content': ['bad!'],
};

export const objectInListInObjectSpec: FieldSpec = {
  name: 'episode',
  label: 'Episode',
  widget: 'object',
  fields: [
    {
      name: 'title',
      label: 'Title',
      widget: 'string',
    },
    {
      name: 'spreads',
      label: 'Spreads',
      widget: 'list',
      fields: [
        {
          name: 'scriptureReference',
          label: 'Scripture Reference',
          widget: 'string',
        },
        {
          label: 'Scripture',
          name: 'scripture',
          widget: 'object',
          fields: [
            {
              label: 'Verse',
              name: 'verse',
              widget: 'markdown',
            },
            {
              label: 'Callout',
              name: 'callout',
              widget: 'string',
            },
          ],
        },
      ],
    },
  ],
};

export const objectInListInObjectModel: {
  episode: {
    title: string;
    spreads: {
      scriptureReference: string;
      scripture: { verse: string; callout: string };
    }[];
  };
} = {
  episode: {
    title: 'The Outing',
    spreads: [
      {
        scriptureReference: 'John 1:1',
        scripture: {
          verse:
            'In the beginning was the **Word**, and the Word was with God, and the Word was God.',
          callout: 'The Word',
        },
      },
      {
        scriptureReference: 'John 1:2',
        scripture: {
          verse: 'He was with God in the beginning.',
          callout: 'He',
        },
      },
    ],
  },
};

export const objectInListInObjectErrors = {
  'bundle.episode.spreads.0.scripture.callout': ['required validation failed'],
  'bundle.episode.spreads.1.scripture.verse': ['required validation failed'],
};

export const scriptureSpec: FieldSpec = {
  name: 'scripture',
  label: 'Scripture',
  widget: 'scripture',
};

export const scriptureModel = {
  scripture: {
    reference: 'John 3:16-17',
    verse:
      '`16` For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.  `17` For God sent not his Son into the world to condemn the world; but that the world through him might be saved.',
  },
};

export const scriptureInListSpec: FieldSpec = {
  name: 'scriptures',
  label: 'Scriptures',
  widget: 'list',
  fields: [
    {
      name: 'scripture',
      label: 'Scripture',
      widget: 'scripture',
    },
  ],
};

export const scriptureInListModel = {
  scriptures: [
    {
      scripture: {
        reference: 'John 3:16',
        verse:
          '`16` For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      },
    },
    {
      scripture: {
        reference: 'John 3:17',
        verse:
          '`17` For God sent not his Son into the world to condemn the world; but that the world through him might be saved.',
      },
    },
  ],
};

export const scriptureInListError = {
  'bundle.scriptures.0.scripture': ['required validation failed'],
};

export const meta: CmsMeta = {
  name: 'The Word One to One',
  logo: 'https://res.cloudinary.com/theword121/image/upload/v1687245360/episodes/viseg2hegowcrapio6pt.svg',
  helpUrl: 'https://www.theword121.com/',
  hasAppPreview: false,
};

export const user = {
  id: 2,
  name: 'John Doe',
  initials: 'JD',
  email: 'john@example.com',
  isManager: true,
  isAdmin: true,
  role: 'editor',
  language: 'en',
  hasPendingInvite: false,
  isAllowed: (locale: string) => locale === 'en',
};

export const stories = ['John', 'Acts'];

export const story: StorySpec = {
  id: 1,
  name: 'John',
  coverImage:
    'https://res.cloudinary.com/theword121/image/upload/v1687245360/episodes/viseg2hegowcrapio6pt.svg',
  chapterLimit: 42,
  chapterType: 'Episode',
  storyType: 'Book',
  schemaVersion: 1,
  fields: [
    {
      label: 'Title',
      name: 'title',
      widget: 'string',
    },
    {
      label: 'Part',
      name: 'part',
      widget: 'number',
      default: 1,
    },

    {
      label: 'Episode Scripture',
      name: 'passage',
      widget: 'scripture',
    },

    {
      label: 'Introduction',
      name: 'intro',
      widget: 'markdown',
    },
  ],

  parts: [
    {
      id: 1,
      title: 'Part 1',
      subtitle: 'God among us',
      description:
        "Could Jesus really be the Word, the Son, the Messiah... God Himself here on earth? Can He give us life that starts now and lasts forever? We're invited to come and see for ourselves.\n\nPart 1 covers John's Gospel (one of the books of the Bible) chapters 1-4.",
    },
    {
      id: 2,
      title: 'Part 2',
      subtitle: 'God at work',
      description:
        "Jesus says He brings life, rest and satisfaction. Powerful words are backed up by amazing miracles... but opinion about Him is divided.\n\nCovering chapters 5-10 of John's Gospel.",
    },
    {
      id: 3,
      title: 'Part 3',
      subtitle: 'Matters of life and death',
      description:
        "The action slows down to focus in on a few short weeks. Could Jesus' death really be His greatest achievement?\n\nCovering chapters 11-17 of John's Gospel.",
    },
    {
      id: 4,
      title: 'Part 4',
      subtitle: 'Mission accomplished!',
      description:
        "Jesus is betrayed by His friends, put on trial and killed. It looks like a disaster. But all is not as it seems...\n\nCovering chapters 18-21 of John's Gospel.",
    },
  ],
};

export const spanish: LanguageSpecification = {
  locale: 'es',
  language: 'Espanol',
  languageDirection: 'ltr',
};

export const english: LanguageSpecification = {
  locale: 'en',
  language: 'English',
  languageDirection: 'ltr',
};

export const burmese: LanguageSpecification = {
  locale: 'my',
  language: 'Burmese - မြန်မာဘာသာ',
  languageDirection: 'ltr',
};

export const ganda: LanguageSpecification = {
  locale: 'lg',
  language: 'Ganda - Luganda',
  languageDirection: 'ltr',
};

export const german: LanguageSpecification = {
  locale: 'de',
  language: 'German - Deutsch',
  languageDirection: 'ltr',
};

export const ukrainian: LanguageSpecification = {
  locale: 'uk',
  language: 'Ukrainian - Українська',
  languageDirection: 'ltr',
};

const languages: LanguageSpecification[] = [
  english,
  spanish,
  burmese,
  ganda,
  german,
  ukrainian,
];

export const sharedProps: SharedPageProps = {
  meta,
  user,
  language: english,
  languages,
  errors: {},
  exclude: [],
};

export const miniSidebar: StoryHandler = (): void => {
  const shared = useSharedStore();
  shared.setSidebarOpen(false);
};
