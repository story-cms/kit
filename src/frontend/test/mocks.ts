import type {
  FieldSpec,
  LanguageSpecification,
  CmsMeta,
  SharedPageProps,
  StorySpec,
  CampaignItem,
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
    'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
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
  'bundle.regions': ['required validation failed'],
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
  bookmarks: [
    { label: 'John', link: '/en/story/1' },
    { label: 'Acts', link: '/en/story/2' },
  ],
};

export const miniSidebar: StoryHandler = (): void => {
  const shared = useSharedStore();
  shared.setSidebarOpen(false);
};

export const alMassira = {
  draft: {
    id: 1912,
    number: 2,
    status: 'started',
    updatedAt: '2025-10-24T06:10:38.483+00:00',
    createdAt: '2025-10-24T06:10:38.482+00:00',
  },
  bundle: {
    extra: '',
    title: 'The Story of Noah and the Flood',
    number: '',
    imageUrl:
      'http://res.cloudinary.com/almassira/image/upload/v1634652071/session_thumbnails/ujntltmyu5sgetlwhwma.png',
    keyTruth:
      '**The Covenant Name of God**\n\nExodus 3:15 / Genesis 4:26\n\nSeth also had a son, and he named him Enosh. At that time men began to call on the name of the **LORD** (YHWH).\n\nLiterally the word YHWH means: ‘He who is’ – the self-existent, eternal being. It is the personal name of God which distinguishes him from all other false gods. YHWH is used over 6500 times and the most common name for God in the Old Testament. This name was so holy that the Jewish people made a rule never to pronounce it.',
    nextStop: {
      intro:
        'If you get the chance, read the following passages in preparation for the next stop on Al Massira',
      reference: 'Genesis 12:1-8, Genesis 15-18 &amp; 21-22',
      referenceText: '',
    },
    sections: [
      {
        notes:
          'Die letzte Woche beendeten wir damit, wie Adam und Eva aus dem Garten vertrieben wurden. Acht Generationen und Hunderte von Jahren vergingen, bevor Noah geboren wurde. Im Verlauf dieser Zeit vervielfachte sich die Bosheit der Menschheit von der Sünde des ersten\nMenschen zu einer Welt beherrscht von Korruption und Gewalt. Nicht nur das, sondern auch die Denkart des Menschen war dauernd böse. Ein richtiger Albtraum breitete sich auf der Erde aus! Was würde die Reaktion vom Himmel sein?\n\n## Gottes Antwort\nGottes Herz trauert. Der Mensch, die Krone seiner Schöpfung, hat sich vollständig von ihm abgewendet. Gottes Trauer ist derart gross, dass er es sogar bedauert, jemals die Erde erschaffen zu haben. Er beschliesst deshalb, alles Leben, nicht nur die Menschheit, sondern auch die Tierwelt, zu vernichten.\n\nWas lernen wir davon?\n* Dass Gott in seiner grossen [Heiligkeit](^Heiligkeit) Sünde leidenschaftlich hasst. Sie erfüllt ihn mit einem göttlichen Zorn.\n* Dass Gott in seinem Wesen emotional ist. Sein Herz wurde mit Schmerz erfüllt. Wenn du liebst, wirst du leiden.\n* Dass Gott seinem Wesen nach Beziehung will – aber Sünde zerstört Beziehungen.\n\nWie aber steht es um den Bund, den Gott im Anfang mit Adam und Eva geschlossen hat? \nHat er ihn aufgegeben?\n\nInmitten aller Verderbnis auf der Erde findet er einen [gerechten](^gerecht) Menschen namens Noah.',
        title: 'Die Entfesselung der Bosheit',
        reference: '1. Mose 6,1-8',
        noteQuestion:
          'Heute hat sich die Sünde auch vervielfacht. Unsere Gegenwart schaut ähnlich aus wie die Zeit von Noah. Denkst du, dass Gott mit uns gleich verfahren wird wie mit Noah?\n',
        openQuestion: 'Warum war Gott so zornig?',
        questionIntro:
          'Zur Zeit Noahs erfüllte Bosheit die Erde. Gottes Herz war bekümmert, und er bedauerte, den Menschen erschaffen zu haben.\n',
        referenceText:
          '## 1. Mose 6,1-8\n\n`1` Als aber die Menschen sich zu mehren begannen auf Erden und ihnen Töchter geboren wurden,... `5` Als aber der Herr sah, dass der Menschen Bosheit groß war auf Erden und alles Dichten und Trachten ihres Herzens nur böse war immerdar, `6` da reute es ihn, dass er die Menschen gemacht hatte auf Erden, und es bekümmerte ihn in seinem Herzen `7` und er sprach: Ich will die Menschen, die ich geschaffen habe, vertilgen von der Erde, vom Menschen an bis hin zum Vieh und bis zum Gewürm und bis zu den Vögeln unter dem Himmel; denn es reut mich, dass ich sie gemacht habe. `8` Aber Noah fand Gnade vor dem Herrn. (Luther)\n\n\n',
        closedQuestion:
          'Warum denkst du, ergriff Gott so drastische Maßnahmen gegenüber der Sünde?\n\nWarum erlaubte es Gott, dass die Rebellion des Menschen sich so vervielfachen konnte, bis diese vernichtende Lösung angewendet werden musste?',
      },
      {
        notes:
          'Noah war ein Mensch und daher nicht vollkommen. Aber er wurde beschrieben als [gerecht](^gerecht) und tadellos in Bezug auf seine Umgebung. Er wandelte mit Gott und pflegte eine offene Beziehung zu ihm. Zudem wurde es von seinem spätern Verhalten her klar, dass er treu und gehorsam war.\n\n## Gott teilt sein Herz mit Noah\nZum ersten Mal in der Geschichte öffnet Gott sein Herz und teilt mit einem Menschen, wie\ner fühlt und was er zu tun gedenkt. \n\nEr teilt zwei wichtige Dinge mit: \n* Er wird alles Fleisch zerstören in einer weltweiten Flut.\n* Er hat einen Rettungsplan für die Menschheit, den er durch Noah ausführen will.\n\nDieser Plan bezieht Noah ein – welche Ehre, dass Gott den Menschen an seinem grossen Plan beteiligt. ABER er hat eine höchst ungewöhnliche Aufgabe zu übernehmen. Er soll das grösste Schiff\nder Welt bauen, und das weit weg vom Meer! Du kannst dir vorstellen, was seine Nachbarn dazu zu sagen hatten! Doch trotz ihres Spottes, den er zweifellos ertragen musste, blieb Noah gegenüber\nGottes Auftrag treu. \n\nIhm wurde aufgetragen, ein Schiff aus Holz zu bauen, das ihn und seine Familie und Vertreter des ganzen Tierreichs retten würde. Das würde die nächste Phase von Gottes verheissenem Bund mit der Menschheit darstellen.',
        title: 'Noah – eine andere Art Mensch',
        reference: '1. Mose 6,9-22',
        noteQuestion:
          'Hat Gott einen Rettungsplan für heute? Wenn ja, bin ich bereit, ihn zu befolgen?',
        openQuestion:
          'Worin bestand der Unterschied zwischen Noah und den Leuten um ihn herum?',
        questionIntro:
          'Noah war gerecht und wandelte mit Gott. Gott teilte Noah seinen Plan mit, die Welt zu zerstören – und Noah und seine Familie zu retten.',
        referenceText:
          '## 1. Mose 6,9-22\n\n`9` Das ist die Geschlechterfolge nach Noah: Noah war ein gerechter, untadeliger Mann unter seinen Zeitgenossen; er ging seinen Weg mit Gott. ... `13` Da sprach Gott zu Noah: Ich sehe, das Ende aller Wesen aus Fleisch ist da; denn durch sie ist die Erde voller Gewalttat. Nun will ich sie zugleich mit der Erde verderben. `14` Mach dir eine Arche aus Zypressenholz! Statte sie mit Kammern aus, und dichte sie innen und aussen mit Pech ab! ... `17` Ich will nämlich die Flut über die Erde bringen, um alle Wesen aus Fleisch unter dem Himmel, alles, was Lebensgeist in sich hat, zu verderben. Alles auif Erden soll verenden.`18` Mit dir aber schliesse ich meinen Bund. Geh in die Arche, du, deine Söhne, deine Frau und die Frauen deiner Söhne! `19` Von allem, was lebt, von allen Wesen aus Fleisch, führe je zwei in die Arche, damit sie mit dir am Leben bleiben; je ein Männchen und ein Weibchen sollen es sein. `20` Von allen Arten der Vögel, von allen Arten des Viehs, von allen Arten der Kriechtiere auf dem Erdboden sollen je zwei zu dir kommen, damit sie am Leben bleiben. ... `22` Noah tat alles genau so, wie ihm Gott aufgetragen hatte. (EÜ)',
        closedQuestion:
          'Als Gott ihm seinen Plan mitteilte, glaubte Noah ihm und begann daran zu arbeiten, obwohl es wie eine unmögliche Aufgabe aussah. Wenn Gott dir seine Pläne mitteilen würde, wärest du bereit zu glauben und sie auszuführen?\n\nWir können uns vorstellen, dass Noah Spott und Hohn begegnet sein müssen, während er die Arche baute. Glaubst du, dass das auch heute geschehen kann – wenn der Herr gläubigen Menschen scheinbar merkwürdige Aufträge erteilt?',
      },
      {
        notes:
          'Nach Gottes Befehl gingen Noah, seine Familie und alle die Tiere in die Arche. Sie vertrauten ihre Rettung dieser Arche aus Holz an. Gott schloss die Tür, der Regen fiel und die Fluten stiegen während 40 Tagen, bis alles Leben zerstört war. Diese kleine Familie lebte isoliert in der Arche während über einem Jahr. Sie hatten sich vollständig Gott und seinem Rettungsplan anvertraut und schwammen in der Arche – wörtlich auf den [Gnadenhänden](^Gnade) Gottes.\n',
        title: 'Regen, Regen und noch mehr Regen!',
        reference: '1. Mose 7',
        noteQuestion:
          'Manchmal bedeutet Gottes Rettungsplan, dass wir unsere ‚alte Welt’ hinter uns lassen müssen. Sind wir bereit, diese Herausforderung anzunehmen, falls Gott sie von uns verlangen sollte?',
        openQuestion:
          'Wie mögen sich Noah und seine Familie in dem Schiff gefühlt haben, so isoliert von allem und allen? ',
        questionIntro:
          'Noah, seine Familie und Vertreter des Tierreichs verbrachten über ein Jahr eingeschlossen in der Arche, die auf den Fluten des Wassers schwamm.',
        referenceText:
          '## 1. Mose 7,1-24\n\n`1` Und der Herr sprach zu Noah: Geh in die Arche, du und dein ganzes Haus; denn dich habe ich gerecht erfunden vor mir zu dieser Zeit. ... `5` Und Noah tat alles, was ihm der Herr gebot. `6` Er war aber sechshundert Jahre alt, als die Sintflut auf Erden kam. `7` Und er ging in die Arche mit seinen Söhnen, seiner Frau und den Frauen seiner Söhne vor den Wassern der Sintflut. `8` Von den reinen Tieren und von den unreinen, von den Vögeln und von allem Gewürm auf Erden `9` gingen sie zu ihm in die Arche paarweise, je ein Männchen und Weibchen, wie ihm Gott geboten hatte. `10` Und als die sieben Tage vergangen waren, kamen die Wasser der Sintflut auf Erden. `11` In dem sechshundertsten Lebensjahr Noahs am siebzehnten Tag des zweiten Monats, an diesem Tag brachen alle Brunnen der großen Tiefe auf und taten sich die Fenster des Himmels auf, `12` und ein\nRegen kam auf Erden vierzig Tage und vierzig Nächte. \n\n... `17` Und die Sintflut war vierzig Tage auf Erden, und die Wasser wuchsen und hoben die Arche auf und trugen sie empor über die Erde. ... `23` So wurde vertilgt alles, was auf dem Erdboden war, vom Menschen an bis hin zum Vieh und zum Gewürm und zu den Vögeln unter dem Himmel; das wurde alles von der Erde vertilgt. Allein Noah blieb übrig und was mit ihm in der Arche war. `24` Und die Wasser wuchsen gewaltig auf Erden hundertundfünfzig Tage. (Luther)',
        closedQuestion:
          'Wie leicht fällt es uns, uns Gott und seinen Wegen anzuvertrauen und uns ihm hinzugeben?',
      },
      {
        notes:
          '## Warum ist Sünde so ein grosses Thema bei Gott?\n\nWarum ist die Strafe so hart? Warum kann Gott nicht einfach vergeben, ohne eine Strafe aufzuerlegen? Wir sind entrüstet, wenn wir sehen, dass Ungerechtigkeit übersehen und ignoriert wird von menschlichen Autoritäten. Warum sollten wir vom heiligen Gott erwarten, dass er\nsich gleich verhält? \n\nDer Herr unser Gott ist heilig, [gerecht](^gerecht) und vollkommen ohne Sünde. Das Zuhause, das Gott für die Ewigkeit bereitet hat, wo er angebetet werden wird und wo er seine Güte mitteilt, ist ein heiliger und vollkommener Ort, ein Ort, wo Sünde, Leiden, Bosheit, Schmerz und Tod keinen Platz haben! [Heiligkeit](^Heiligkeit) und Sünde können nicht zusammen existieren – in gleicher Weise wie Feuer und Benzin. Es muss zu einer Reaktion kommen. Sei gewarnt! Wo Gott wohnt haben nur Reine Zugang!\n\nDas ist der Grund, warum es Gott ernst ist und er keine Kompromisse mit Sünde duldet. Er will uns warnen und uns zeigen, dass er Sünde immer verurteilen und bestrafen wird. Die Strafe ist ernsthaft. Sie ist der Tod. Die Flut ist ein Bild, ein Zeichen, ein Hinweis auf den Zorn Gottes über alle Bosheit am Tag des Gerichts. Die Taten und sogar die unreinen Gedanken der Menschen werden gerichtet werden. Und es gibt nur eine Strafe – der Tod. \n\nABER – Gott ist auch geduldig und sein Mitleid für Menschen ist grenzenlos. Er wird immer denen nachgehen, die ihn mit Demut und Bußbereitschaft suchen. Für diese Menschen hat er aus grossem Erbarmen einen Rettungsplan bereit gestellt.\nIn Psalm 85 lesen wir von diesem Ort der Rettung, wo Gottes Zorn sich trifft mit seiner grossen Liebe, wo Gerechtigkeit, Wahrheit und Recht sich mit [Gnade](^Gnade), Liebe und Frieden vereinigen.',
        title: 'Das Göttliche Paradox – Gerechtigkeit und Gnade!',
        reference: 'Psalm 85',
        noteQuestion:
          'Habe ich diesen Ort gefunden, wo Gottes Gericht und Gnade sich treffen?',
        openQuestion:
          'Warum ist Sünde eine so wichtige Angelegenheit?\n\nWarum kann Gott nicht einfach vergeben, ohne eine so strenge Strafe auferlegen zu müssen?\n\nKann jemand Gottes Strafe entgehen?\n\nKann ein heiliger Gott mit einem sündigen Menschen im Himmel wirklich koexistieren?',
        questionIntro:
          'Sünde ist für den heiligen Gott ein Problem. Rettung und Befreiung: die Arche ist der Ort, wo Gericht und Gnade sich treffen.',
        referenceText:
          '## Psalm 85,3-13\n\n`3` Du hast deinem Volk die Schuld vergeben, all seine Sünden zugedeckt,\n`4` hast zurückgezogen deinen ganzen Grimm und deinen glühenden Zorn gedämpft.\n`5` Gott, unser Retter, richte uns wieder auf, lass von deinem Unmut gegen uns ab!\n`6` Willst du uns ewig zürnen, soll dein Zorn dauern von Geschlecht zu Geschelcht?\n`7` Willst du uns nicht wieder beleben, so dass dein Volk sich an dir freuen kann?\n`8` Erweise uns, Herr, deine Huld, und gewähre uns dein Heil!\n`9` Ich will hören, was Gott redet, Frieden verkündet der Herr seinem Volk \nund seinen Frommen, den Menschen mit redlichem Herzen.\n`10` Sein Heil ist denen nahe, die ihn fürchten. Seine Herrlichkeit wohne in unserm Land.\n`11` Es begegnen einander Huld und Treue; Gerechtigkeit und Friede küssen sich.\n`12` Treue sprosst aus der Erde hervor. Gerechtigkeit blickt vom Himmel hernieder.\n`13` Auch spendet der Herr dann Segen, und unser Land gibt seinen Ertrag.\n(Luther)',
        closedQuestion:
          'Warum ist der Tod die Strafe für die Sünde?\n\nWie kann Gottes Lösung gleichzeitig seine Gnade und seinen Zorn gegenüber der Menschheit zeigen?',
      },
      {
        notes:
          'Die Wasser weichen, die Arche landet,  der Boden wird trocken und Noah und seine Familie verlassen die Arche. Ohne einen Auftrag vom Herrn baut Noah sogleich einen [Altar](^Altar), um Gott anzubeten und opfert (verbrennt) eines von allen ‚reinen’ Tieren auf ihm. Gott riecht den Geruch des Opfers mit Wohlgefallen. Er antwortet mit einer Verheissung, die bis zum heutigen Tag gilt – er wird die ganze Menschheit nie wieder zerstören!\n\n## Was geschieht da eigentlich?\n\nNoah versteht das Zeichen seines Vorvater Abels, dass \n* Anbetung Gottes mittels eines Tieropfers ein Gehorsamszeichen ist, das Gott gefällt\n* Anbetung Gottes den Tod eines ‚reinen’ Tieres erfordert, welches den Platz des Menschen einnimmt.\n\nSpäter lesen wir beim Propheten Mose, dass das [Brandopfer ](^Brandopfer )die totale Hingabe an Gott bedeutet. Es verschafft [Sühne](^Suehne) (oder Bedecken) für die Sünde des Menschen. Das Tieropfer entfernt die Sünde selber nicht, aber es ist ein Bild dafür, was nötig wäre und weist auf ein zukünftiges Geschehnis.\n\nGott riecht dieses Opfer und sein Zorn / Gericht wird besänftigt. Seine Beziehung zur Menschheit kann wieder hergestellt werden. Das setzt eine Verheissung und eine Bestätigung eines ewigen Bundes frei.',
        title: 'Die Arche verlassen',
        reference: '1. Mose 8',
        noteQuestion:
          'Wie kann der Tod eines Tieres den Platz einer Person einnehmen? Was bedeutet das heute – und was (oder wer) hat meinen Platz eingenommen?',
        openQuestion:
          'Was wäre deine erste Tätigkeit gewesen nach einem Jahr auf einem Schiff mit einer Ladung von Tieren?\n\nWarum baut Noah einen Altar?',
        questionIntro:
          'Die Fluten gehen zurück; Noah und seine Familie verlassen die Arche. Er baut einen Altar, um ein Opfer darzubringen und den Herrn anzubeten. Gott antwortet auf Noahs Brandopfer.',
        referenceText:
          '## 1. Mose 8,1-21\n\n`1` Da gedachte Gott an Noah und an alles wilde Getier und an alles Vieh, das mit ihm in der Arche war, und ließ Wind auf Erden kommen und die Wasser fielen. ...`15` Da redete Gott mit Noah und sprach: 16 Geh aus der Arche, du und deine Frau, deine Söhne und die Frauen deiner Söhne mit dir. `17` Alles Getier, das bei dir ist, von allem Fleisch, an Vögeln, an Vieh und allem Gewürm, das auf Erden kriecht, das gehe heraus mit dir, dass sie sich regen auf Erden und fruchtbar seien und sich mehren auf Erden. `18` So ging Noah heraus mit seinen Söhnen und mit seiner Frau und den Frauen seiner Söhne, `19` dazu alle wilden Tiere, alles Vieh, alle Vögel und alles Gewürm, das auf Erden kriecht; das ging aus der Arche, ein jedes mit seinesgleichen. `20` Noah aber baute dem HERRN einen Altar und nahm von allem reinen Vieh und von allen reinen Vögeln und opferte Brandopfer auf dem Altar. `21`  Und der HERR roch den lieblichen Geruch und sprach in seinem Herzen: Ich will hinfort nicht mehr die Erde verfluchen um der Menschen willen; denn das Dichten und Trachten des menschlichen Herzens ist böse von Jugend auf. Und ich will hinfort nicht mehr schlagen alles, was da lebt, wie ich getan habe. (Luther)',
        closedQuestion:
          'Warum freut sich Gott am Geruch von geopferten Tieren?\n\nWarum ist es wichtig, „reine” Tiere zu opfern?',
      },
      {
        notes:
          'Gott gibt Noah einen Bund oder ein Zeichen mit folgendem Inhalt:\n\n* Er befiehlt Noah, fruchtbar zu sein und die Erde zu bevölkern.\n\n* Es misst dem Menschenleben den höchsten Wert zu, weil der Mensch nach dem Bild Gottes gemacht ist.\n\n* Er schliesst seinen Bund durch Noah mit allen Völkern der Erde.\n\n* Nie wieder wird er alle Lebenwesen zerstören.\n\n* Der Regenbogen ist das Zeichen dieses Bundes.\n\nGott wird seine Verheissung einhalten und der Bund wird weitergehen zur nächsten Generation. Wir haben von Noah mehr über Gottes Herz, seine Antwort auf das Böse und seinen göttlichen\nRettungsplan gelernt. Weiter gilt auch immer noch die Verheissung des ‚Samen der Frau’, des [Erlösers](^Erloeser), die auf ein zukünftiges Geschehnis weist.',
        title: 'Der Bund wieder erneuert',
        reference: '1. Mose 9,1-15',
        noteQuestion:
          'Gibt es eine Arche für mich – einen Ort der Rettung vor der Strafe Gottes? \nWo ist er?',
        openQuestion:
          'Was sind die verschiedenen Teile des Bundes, den Gott mit Noah bestätigt?\n\nNachdem wir die Geschichte von Noah kennen gelernt haben, glaubst du, dass es eine Tiefe der Sünde gibt, die Gottes Rettungsplan nicht erreicht?',
        questionIntro:
          'Gott der Herr verspricht, die Erde nie wieder zu zerstören. Er erneuert seinen Bund mit der Menschheit.',
        referenceText:
          '## 1. Mose 9,1-15\n\n`1` Dann segnete Gott Noah und seine Söhne und sprach zu ihnen: Seid fruchtbar, vermehrt euch, und bevölkert die Erde! ... `3` Alles übergebe ich euch wie die grünen Pflanzen. ... `6` Wer Menschenblut vergiesst, dessen Blut wird durch Menschen vergossen. Denn: Als Abbild Gottes hat er den Menschen gemacht. ... `8` Dann sprach Gott zu Noah und seinen Söhnen, die bei ihm waren: `9` Hiermit schliesse ich meinen Bund mit euch und mit euren Nachkommen `10` und mit allen Lebewesen bei euch, mit den Vögeln, dem Vieh und allen Tieren des Feldes, mit allen Tieren der Erde, die mit euch aus der Arche gekommen sind. `11` Ich habe meinen Bund mit euch geschlossen: Nie wieder sollen alle Wesen aus Fleisch vom Wasser der Flut ausgerottet werden; nie wieder soll eine Flut kommen und die Erde verderben. `12` Und Gott sprach: Das ist das Zeichen des Bundes, den ich stifte zwischen mir und euch und den lebendigen Wesen bei euch für alle kommenden Generationen: `13` Meinen Bogen setze ich in die Wolken; er soll das Bundeszeichen sein zwischen mir und der Erde. `14` Balle ich Wolken über der Erde zusammen und erscheint der Bogen in den Wolken, `15` dann gedenke ich des Bundes, der besteht zwischen mir und euch und allen Lebewesen, allen Wesen aus Fleisch, und das Wasser wird nie wieder zur Flut werden, die alle Wesen aus Fleisch vernichtet. (EÜ)',
        closedQuestion:
          'Ist Gottes Rettungsplan stark genug, uns in den Problemen der heutigen Welt zu erreichen?',
      },
    ],
    videoUrl: 'https://youtu.be/GmPfTVl2JWI',
    footnotes: [
      {
        key: 'gerecht',
        description:
          'Ein gerechter Mann oder eine Frau ist jemand, der in allem, was er tut, Gott zu gefallen sucht.',
      },
      {
        key: 'Gnade',
        description: 'Gottes unwandelbare Liebe, ausgedrückt gegenüber der Menschheit.',
      },
      {
        key: 'Erloeser',
        description:
          'Erlöser\nEiner, der die Fähigkeit und den Willen hat, jemanden zu retten, und dann die Rettung auch ausführt.',
      },
      {
        key: 'Suehne',
        description: 'Sühne\nDie Tat des Zudeckens und Auslöschens von Sünde.',
      },
      {
        key: 'Heiligkeit',
        description:
          'Eine verzehrende Leidenschaft und Liebe zu Gott, die einen abhält zu sündigen.',
      },
      {
        key: 'Altar',
        description:
          'Ein Ort, gewöhnlich aus Stein oder aus Holz, das mit einer Metallschicht geschützt ist, auf dem  Opfer verbrannt werden.',
      },
      {
        key: 'Brandopfer',
        description:
          'Ein Opfer für Gott, das die vollständige Hingabe an ihn bedeutet. Dieses Opfer versinnbildlicht unsere Buße, Abwendung von der Sünde und Hinwendung zum Herrn.',
      },
    ],
    conclusion:
      '# Link\nFrom Noah people spread out to fill the earth. However, when men reached the plain of Shinar (present-day Iraq), they decided to build a city and a high tower. They wanted to gather and make a name for themselves and rebelled against God’s command to spread out and fill the earth. Therefore God came down from heaven, confused their language and scattered them across the face of the earth (Genesis 10-11). Nearly 300 years after the flood and 10 generations in direct line from Shem the son of Noah, a man named Abraham was born. He is known by many as the ‘friend of God’. His name means ‘father of many’. His story is the next stop on our journey.',
  },
  lastPublished: '2025-03-06T22:51:06.741+00:00',
  providers: {
    s3: {
      accessKeyId: '',
      accessKey: '',
      bucket: '',
      region: '',
      endpoint: '',
      customDomain: '',
    },
    cloudinary: {
      apiKey: 'redacted',
      secret: 'redacted',
      cloudName: 'almassira',
      defaultPreset: 'session_thumbnail',
    },
    scripture: { bibleApiKey: 'tmp' },
  },
  story: {
    id: 1,
    name: 'Follow the Prophets',
    coverImage:
      'https://res.cloudinary.com/redeem/image/upload/v1752849347/story-cms-ui/placeholder_bafmfz.jpg',
    chapterType: 'Lesson',
    storyType: 'Course',
    chapterLimit: 13,
    schemaVersion: 1,
    fields: [
      {
        widget: 'panel',
        fields: [
          { label: 'Title', name: 'title', widget: 'string' },
          {
            label: 'Image',
            name: 'imageUrl',
            widget: 'image',
            uploadPreset: 'session_thumbnail',
          },
          { label: 'Video URL', name: 'videoUrl', widget: 'string' },
          {
            label: 'Short Video URL',
            name: 'shortVideoUrl',
            widget: 'string',
          },
        ],
      },
      {
        label: 'Sections',
        name: 'sections',
        widget: 'list',
        canFold: true,
        fields: [
          { label: 'Title', name: 'title', widget: 'string' },
          { label: 'Reference', name: 'reference', widget: 'string' },
          {
            label: 'Reference Text',
            name: 'referenceText',
            widget: 'markdown',
          },
          { label: 'Notes', name: 'notes', widget: 'markdown' },
          {
            label: 'Note Question',
            name: 'noteQuestion',
            widget: 'markdown',
          },
          {
            label: 'Question Intro',
            name: 'questionIntro',
            widget: 'markdown',
          },
          {
            label: 'Question One',
            name: 'openQuestion',
            widget: 'markdown',
          },
          {
            label: 'Question Two',
            name: 'closedQuestion',
            widget: 'markdown',
          },
        ],
      },
      { label: 'Conclusion', name: 'conclusion', widget: 'markdown' },
      {
        label: '',
        name: 'nextStop',
        widget: 'object',
        fields: {
          intro: {
            label: 'Next Stop Instruction',
            name: 'intro',
            widget: 'markdown',
          },
          reference: {
            label: 'Next Stop Bible Passage(s)',
            name: 'reference',
            widget: 'string',
          },
        },
      },
      { label: 'Key Truth', name: 'keyTruth', widget: 'markdown' },
      { label: 'Extra', name: 'extra', widget: 'markdown' },
      {
        label: 'Footnotes',
        name: 'footnotes',
        widget: 'list',
        fields: [
          { label: 'Key', name: 'key', widget: 'string' },
          {
            label: 'Description',
            name: 'description',
            widget: 'markdown',
          },
        ],
      },
    ],
  },
  hasEditReview: false,
  meta: {
    name: 'Journey CMS',
    hasAppPreview: false,
    helpUrl: 'https://journeys.helpscoutdocs.com/',
    logo: 'https://res.cloudinary.com/almassira/image/upload/v1715699258/logo_funy66.png',
  },
  user: {
    id: 2,
    email: 'service@example.com',
    name: 'Admin',
    language: '*',
    createdAt: '2021-08-16T07:12:35.394+00:00',
    updatedAt: '2023-07-26T11:17:00.773+00:00',
    role: 'admin',
    isManager: true,
    isAdmin: true,
    initials: 'A',
    hasPendingInvite: false,
    meta: {
      id: 2,
      name: 'Admin',
      email: 'service@example.com',
      role: 'admin',
      language: '*',
      initials: 'A',
      hasPendingInvite: false,
      lastActivity: null,
    },
  },
  language: {
    locale: 'de',
    language: 'German - Deutsch',
    languageDirection: 'ltr',
  },
  languages: [
    { locale: 'en', language: 'English', languageDirection: 'ltr' },
    {
      locale: 'sq',
      language: 'Albanian - Shqipe',
      languageDirection: 'ltr',
    },
    {
      locale: 'am',
      language: 'Amharic - አማርኛ',
      languageDirection: 'ltr',
    },
    { locale: 'ar', language: 'Arabic - عربى', languageDirection: 'rtl' },
    {
      locale: 'bm',
      language: 'Bambara - Bamanankan',
      languageDirection: 'rtl',
    },
    {
      locale: 'bn',
      language: 'Bengali - বাংলা',
      languageDirection: 'ltr',
    },
    {
      locale: 'zh',
      language: 'Chinese - 中文',
      languageDirection: 'ltr',
    },
    { locale: 'prs', language: 'Dari - دری', languageDirection: 'rtl' },
    {
      locale: 'nl',
      language: 'Dutch - Nederlands',
      languageDirection: 'ltr',
    },
    {
      locale: 'fr',
      language: 'French - Français',
      languageDirection: 'ltr',
    },
    {
      locale: 'ff',
      language: 'Fulah Adamawa – Fulfulde Adamawa',
      languageDirection: 'ltr',
    },
    {
      locale: 'ka',
      language: 'Georgian – ქართული',
      languageDirection: 'ltr',
    },
    {
      locale: 'de',
      language: 'German - Deutsch',
      languageDirection: 'ltr',
    },
    { locale: 'ha', language: 'Hausa', languageDirection: 'ltr' },
    {
      locale: 'id',
      language: 'Indonesian - Bahasa Indonesia',
      languageDirection: 'ltr',
    },
    {
      locale: 'it',
      language: 'Italian - Italiano',
      languageDirection: 'ltr',
    },
    {
      locale: 'ckb',
      language: 'Kurdish Sorani – کوردی سۆرانی',
      languageDirection: 'rtl',
    },
    {
      locale: 'ku',
      language: 'Kurmanji - Kurmancî',
      languageDirection: 'ltr',
    },
    { locale: 'ps', language: 'Pashto - پښتو', languageDirection: 'rtl' },
    {
      locale: 'fa',
      language: 'Persian - فارسی',
      languageDirection: 'rtl',
    },
    {
      locale: 'pt',
      language: 'Portuguese - Português',
      languageDirection: 'ltr',
    },
    {
      locale: 'ru',
      language: 'Russian – Русский',
      languageDirection: 'ltr',
    },
    {
      locale: 'so',
      language: 'Somali - Af Soomaali',
      languageDirection: 'ltr',
    },
    {
      locale: 'es',
      language: 'Spanish - Español',
      languageDirection: 'ltr',
    },
    {
      locale: 'sw',
      language: 'Swahili – Kiswahili',
      languageDirection: 'ltr',
    },
    {
      locale: 'shi',
      language: 'Tachelhite - Taclḥiyt',
      languageDirection: 'ltr',
    },
    {
      locale: 'th',
      language: 'Thai - ภาษาไทย',
      languageDirection: 'ltr',
    },
    {
      locale: 'tr',
      language: 'Turkish - Türkçe',
      languageDirection: 'ltr',
    },
    { locale: 'ur', language: 'Urdu - اُردو', languageDirection: 'rtl' },
    {
      locale: 'uz',
      language: 'Uzbek – أۇزبېك ﺗﻴﻠی',
      languageDirection: 'rtl',
    },
  ],
  exclude: ['stream', 'audience'],
  bookmarks: [],
  source: {
    extra: '',
    title: 'The Story of Noah and the Flood',
    number: '',
    imageUrl:
      'http://res.cloudinary.com/almassira/image/upload/v1634652071/session_thumbnails/ujntltmyu5sgetlwhwma.png',
    keyTruth:
      '**The Covenant Name of God**\n\nExodus 3:15 / Genesis 4:26\n\nSeth also had a son, and he named him Enosh. At that time men began to call on the name of the **LORD** (YHWH).\n\nLiterally the word YHWH means: ‘He who is’ – the self-existent, eternal being. It is the personal name of God which distinguishes him from all other false gods. YHWH is used over 6500 times and the most common name for God in the Old Testament. This name was so holy that the Jewish people made a rule never to pronounce it.',
    nextStop: {
      intro:
        'If you get the chance, read the following passages in preparation for the next stop on Al Massira',
      reference: 'Genesis 12:1-8, Genesis 15-18 &amp; 21-22',
      referenceText: '',
    },
    sections: [
      {
        notes:
          'Last week we finished as Adam and Eve were ejected from the garden.\n\nEight generations and hundreds of years pass before Noah is born. Through this time, the wickedness of man has multiplied from the one sin of the first man to a world engulfed in corruption and violence. Not only this, but even mankind’s way of thinking is constantly evil. A nightmare has been unleashed on the earth! What will be the reaction from heaven?\n\n**God’s response**\n\nThe heart of God is grieved. Man, the pinnacle of his creation, has completely turned his back on him. God’s grief is such that he regrets he ever created the earth. He therefore determine that he will destroy all flesh, not just mankind but the animal world too.\n\nWhat do we understand from this?\n\n* That God in his great [holiness](^Holiness) hates sin with a passion – it makes him divinely angry.\n* That God in his nature is emotional, his heart was filled with pain. If you love you will suffer.\n* That God in his nature is relational – but sin breaks that relationship.\n\nBut what of the covenant God first gave to Adam and Eve? Has God abandoned it?\n\nIn the midst of all the corruption on the earth, he finds a [righteous](^righteous) man called Noah.\n',
        title: 'The Unleashing of Evil',
        reference: 'Genesis 6:1-8',
        noteQuestion:
          'Nowadays, sin is multiplying and our era looks similar to that of Noah.\n\nDo you think God will do with us what he did with Noah?',
        openQuestion: 'Why was God so upset?',
        questionIntro:
          'In the time of Noah - wickedness had filled the earth. God’s heart grieved and he regretted his creation of man.',
        referenceText:
          '**Genesis 6:1-8**\n\n`1` When men began to increase in number on the earth and daughters were born to them... `5` The LORD saw how great man’s wickedness on the earth had become, and that every inclination of the thoughts of his heart was only evil all the time. `6` The LORD was grieved that he had made man on the earth, and his heart was filled with pain. `7` So the LORD said, “I will wipe mankind, whom I have created, from the face of the earth—men and animals, and creatures that move along the ground, and birds of the air—for I am grieved that I have made them.” `8` But Noah found favour in the eyes of the LORD.',
        closedQuestion:
          'Why do you think God took such drastic action against sin?\n\nWhy did God allow the rebellion of man to multiply until this devastating solution had to be applied?',
      },
      {
        notes:
          'Noah was human, so could not have been perfect. However he was described as righteous and blameless before his people. He walked with God and openly related to him. In addition to this, it is clear from his subsequent actions that he was faithful and obedient.\n\n## God shares his heart with Noah\nFor the first time in history God opens his heart and shares with man both how he feels and what he is going to do. He shares two important things:\n\n* He is going to destroy all flesh through a worldwide flood\n* That he has a rescue plan for mankind that will be worked out through Noah.\n\nThat plan involves Noah – what an honour that God involves man in his great plan – BUT he has to take on the highly unusual task of building the world’s biggest boat far from the sea! You can imagine what his neighbours had to say about that! Yet despite the ridicule he no doubt endured, Noah was faithful to God’s command.\n\nHe was instructed to build a vessel out of wood which would save him and his family and representatives of all the animal kingdom. This would fulfil the next stage of God’s covenant promise to mankind.',
        title: 'Noah – a Different Kind of Man?',
        reference: 'Genesis 6:9-22',
        noteQuestion:
          'Does God have a rescue plan for today?\n\nIf so, am I ready to follow it?',
        openQuestion: 'What made Noah different from the people around him?',
        questionIntro:
          'Noah was a righteous man and walked with God. God shares his plan to destroy the world – and to save Noah and his family.',
        referenceText:
          '**Genesis 6:9-22**\n\n`9` This is the genealogy of Noah. Noah was a just man, perfect in his generations. Noah walked with God... `13`  And God said to Noah, “The end of all flesh has come before Me, for the earth is filled with violence through them; and behold, I will destroy them with the earth. `14` Make yourself an ark of gopherwood; make rooms in the ark, and cover it inside and outside with pitch... `17` And behold, I Myself am bringing floodwaters on the earth, to destroy from under heaven all flesh in which is the breath of life; everything that is on the earth shall die. `18` But I will establish My covenant with you; and you shall go into the ark—you, your sons, your wife, and your sons’ wives with you. `19` And of every living thing of all flesh you shall bring two of every sort into the ark, to keep them alive with you; they shall be male and female. `20` Of the birds after their kind, of animals after their kind, and of every creeping thing of the earth after its kind, two of every kind will come to you to keep them alive... `22` Thus Noah did; according to all that God commanded him, so he did.',
        closedQuestion:
          'When God shared his plan, Noah believed in it and started work even though it looked an impossible task. \n\nIf God were to share his plans with you, would you be ready to believe and walk in them?\n\nWe think that Noah must have faced ridicule and mockery as he built the ark. Do you think that this happens today - when believers are asked by the Lord to do what appear to be unusual tasks?',
      },
      {
        notes:
          'Following God’s command, Noah, his family and all the animals entered the ark, entrusting their salvation to this ark of wood. God closed the door, the rain fell, the floods rose for 40 days until every living thing was destroyed. \n\nThis small family lived isolated on the ark for more than one year. They were completely surrendered to God and his rescue plan, floating on the Ark – literally in God’s hands of mercy.',
        title: 'Rain, Rain and More Rain!',
        reference: 'Genesis 7',
        noteQuestion:
          'Sometimes God’s rescue plan means we have to leave our ‘old world’ behind.\n\nAre we ready to take this challenge should God ask it of us?',
        openQuestion:
          'What would it have felt like for Noah and family on the boat, isolated from everything and everyone?',
        questionIntro:
          'Noah, his family, and representatives of the animal kingdom spent more than one year, locked in the ark, floating on top of the flood waters.',
        referenceText:
          '**Genesis 7:1-24**\n\n`1` The LORD then said to Noah, “Go into the ark, you and your whole family, because I have found you righteous in this generation... `5` And Noah did all that the LORD commanded him. `6` Noah was six hundred years old when the floodwaters came on the earth. `7` And Noah and his sons and his wife and his sons’ wives entered the ark to escape the waters of the flood. `8` Pairs of clean and unclean animals, of birds and of all creatures that move along the ground, `9` male and female, came to Noah and entered the ark, as God had commanded Noah. `10` And after the seven days the floodwaters came on the earth. `11` In the six hundredth year of Noah’s life, on the seventeenth day of the second month—on that day all the springs of the great deep burst forth, and the floodgates of the heavens were opened. `12` And rain fell on the earth forty days and forty nights... \n`17` For forty days the flood kept coming on the earth, and as the waters increased they lifted the ark high above the earth... `23` Every living thing on the face of the earth was wiped out; men and animals and the creatures that move along the ground and the birds of the air were wiped from the earth. Only Noah was left, and those with him in the ark. `24` The waters flooded the earth for a hundred and fifty days.',
        closedQuestion:
          'How easy do we find it to surrender and abandon ourselves to God and his way?',
      },
      {
        notes:
          '**Why is sin such a big issue with God?**\n\nWhy is the punishment so severe? Why cannot God just forgive without imposing punishment? We are outraged when we see injustice overlooked and ignored by human rulers, so why shouldn’t we expect the holy God himself to do the same?\n\nThe Lord our God is holy, righteous and completely without sin. The home God has made for eternity, where he will be worshiped and where he shares his goodness, is a holy and perfect place, a place where sin, suffering, evil, pain and death have no place! Holiness and sin cannot co-exist – in a similar way to fire and petrol. There must be a reaction. Be warned that where God dwells only the pure can enter!\n\nThat is why God is serious and uncompromising with sin. He wants to warn us and show us that he will always judge and punish sin. The judgement is serious and the punishment is death. The flood is a picture, a sign pointing to the wrath of God on all evil on the day of judgement. The actions and even the impure thoughts of man will be judged and there is only one penalty – death.\n\nBUT – God is also patient and his compassion for people is beyond measure. He will always search for those who are searching for him in humility and repentance. For these ones, out of his great mercy, he provides a rescue plan. In Psalm 85, we read that the place of salvation is where the anger of God meets with his great love, where justice, truth and righteousness meet with mercy, love and peace.',
        title: 'Divine Paradox – Justice or Mercy?',
        reference: 'Psalm 85',
        noteQuestion: 'Have I found the place where God’s judgement and mercy meet?',
        openQuestion:
          'What would it have felt like for Noah and family on the boat, isolated from everything and everyone?',
        questionIntro:
          'Noah, his family, and representatives of the animal kingdom spent more than one year, locked in the ark, floating on top of the flood waters.',
        referenceText:
          '**Psalm 85**\n\n`2` You have forgiven the iniquity of Your people; You have covered all their sin. Selah\n`3` You have taken away all Your wrath;\nYou have turned from the fierceness of Your anger.\n`4`  Restore us, O God of our salvation,\nAnd cause Your anger toward us to cease.\n`5`  Will You be angry with us forever?\nWill You prolong Your anger to all generations?\n`6`  Will You not revive us again,\nThat Your people may rejoice in You?\n`7`  Show us Your mercy, LORD,\nAnd grant us Your salvation.\n`8`  I will hear what God the LORD will speak, For He will speak peace\nTo His people and to His saints;\nBut let them not turn back to folly.\n`9`  Surely His salvation is near to those who fear Him, That glory may dwell in our land.\n`10`  Mercy and truth have met together; Righteousness and peace have kissed.\n`11`  Truth shall spring out of the earth,\nAnd righteousness shall look down from heaven.\n`12`  Yes, the LORD will give what is good;\nAnd our land will yield its increase.',
        closedQuestion:
          'How easy do we find it to surrender and abandon ourselves to God and his way?',
      },
      {
        notes:
          'The waters subside, the ark lands, the ground becomes dry and Noah and his family leave the ark. Without any instruction from the Lord, Noah immediately builds an [altar](^Altar) to worship God and sacrifices (burns) one of each of the ‘clean’ animals on it. God smells the offering with pleasure and responds with a promise that holds good to this day – he will never again destroy all mankind!\n\n**What is actually happening here?**\nNoah understands the sign of his forefather Abel, that worship:\n\n* Through sacrifice, is a sign of obedience that pleases God\n* Requires the death of a ‘clean’ animal, which is needed to take the place of man\n\nLater we read from the prophet Moses that the [burnt offering](^Burnt) signifies a total surrender to God, providing an atonement (or covering) for the sin of man. The sacrifice of an animal does not remove sin itself but it is a picture of what is needed and it points towards a future event.\nGod smells this sacrifice and his anger/ judgement is appeased; his relationship with mankind can be restored. This releases a promise and the affirmation of an eternal covenant.',
        title: 'Leaving the Ark',
        reference: 'Genesis 8',
        noteQuestion:
          'How can the death of an animal take the place of a person? \n\nWhat about today – and what (or who) has taken my place?',
        openQuestion:
          'What would have been your first activity after one year in a boat with a load of animals?\n\nWhy does Noah build the altar?',
        questionIntro:
          'The floods subside; Noah and family leave the ark, and build an altar for sacrifice, and worship the Lord. God responds to Noah’s burnt offering.',
        referenceText:
          '**Genesis 8**\n\n`1` But God remembered Noah and all the wild animals and the livestock that were with him in the ark, and he sent a wind over the earth, and the waters receded... `15`  Then God said to Noah, 16 “Come out of the ark, you and your wife and your sons and their wives. `17`  Bring out every kind of living creature that is with you—the birds, the animals, and all the creatures that move along the ground—so they can multiply on the earth and be fruitful and increase in number upon it.” `18`  So Noah came out, together with his sons and his wife and his sons’ wives. `19`  All the animals and all the creatures that move along the ground and all the birds—everything that moves on the earth—came out of the ark, one kind after another. `20`  Then Noah built an altar to the LORD and, taking some of all the clean animals and clean birds, he sacrificed burnt offerings on it. `21`  The LORD smelled the pleasing aroma and said in his heart: “Never again will I curse the ground because of man, even though every inclination of his heart is evil from childhood. And never again will I destroy all living creatures, as I have done. “',
        closedQuestion:
          'Why is God pleased with the smell of the burnt animals?\n\nWhy is it important to sacrifice a ‘clean’ animal?',
      },
      {
        notes:
          'This is the covenant, or sign, that God gives to Noah:\n\n* He commands Noah to be fruitful, to multiply and to fill the earth.\n* He places the highest value on the life of man, because man is made in the image of God.\n* He establishes his covenant through Noah with all peoples of the earth.\n* Never again will he destroy all living things.\n* The rainbow is to be the sign of this covenant.\n\nGod will keep his promise and the covenant will pass on to the next generation. We have learned through Noah more about God’s heart, his response to evil and his divine rescue plan. Also the promise of the ‘seed of the woman’ the [Redeemer](^Redeemer), still stands, pointing towards a future time.',
        title: 'The Covenant Renewed Again',
        reference: 'Genesis 9:1-17',
        noteQuestion:
          'Is there an ark for me – a place of rescue from the punishment of God? Where is it?',
        openQuestion:
          'What are the different parts of the covenant that God affirms to Noah?\n\nAfter learning about the story of Noah – do you think there is any depth of sin to which God’s rescue plan cannot reach?',
        questionIntro:
          'The Lord God promises never again to destroy the earth and he renews his covenant with mankind.',
        referenceText:
          '**Genesis 9:1-17**\n\n`1` Then God blessed Noah and his sons, saying to them, “Be fruitful and increase in number and fill the earth... `3` Everything that lives and moves will be food for you. Just as I gave you the green plants, I now give you everything... `6` “Whoever sheds the blood of man, by man shall his blood be shed; for in the image of God has God made man...” `8` Then God said to Noah and to his sons with him: `9` “I now establish my covenant with you and with your descendants after you `10` and with every living creature that was with you—the birds, the livestock and all the wild animals, all those that came out of the ark with you— every living creature on earth. `11` I establish my covenant with you: Never again will all life be cut off by the waters of a flood; never again will there be a flood to destroy the earth.” `12` And God said, “This is the sign of the covenant I am making between me and you and every living creature with you, a covenant for all generations to come: `13` I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth. `14` Whenever I bring clouds over the earth and the rainbow appears in the clouds, `15` I will remember my covenant between me and you and all living creatures of every kind. Never again will the waters become a flood to destroy all life. “',
        closedQuestion:
          'Is God’s rescue plan powerful enough to reach us in the problems of today’s world?',
      },
    ],
    videoUrl: 'https://youtu.be/GmPfTVl2JWI',
    footnotes: [
      {
        key: 'righteous',
        description:
          'A righteous man or woman is someone who seeks to please God in everything he does.',
      },
      {
        key: 'Mercy',
        description: 'God’s unchanging love expressed towards mankind.',
      },
      {
        key: 'Redeemer',
        description:
          'Somebody who has the ability and the willingness to rescue someone, and then comes to the rescue.',
      },
      {
        key: 'Atonement',
        description: 'The act of covering or blotting out sins.',
      },
      {
        key: 'Holiness',
        description:
          'A consuming passion and love for God that prevents one from sinning.',
      },
      {
        key: 'Altar',
        description:
          'A place, usually of stone or wood covered by a layer of metal, where sacrifices are burned.',
      },
      {
        key: 'Burnt',
        description:
          'Burnt offering\nA sacrifice made to God symbolizing our complete dedication to him. This offering symbolizes our repentance and turning from sin towards the Lord.',
      },
    ],
    conclusion:
      '# Link\nFrom Noah people spread out to fill the earth. However, when men reached the plain of Shinar (present-day Iraq), they decided to build a city and a high tower. They wanted to gather and make a name for themselves and rebelled against God’s command to spread out and fill the earth. Therefore God came down from heaven, confused their language and scattered them across the face of the earth (Genesis 10-11). Nearly 300 years after the flood and 10 generations in direct line from Shem the son of Noah, a man named Abraham was born. He is known by many as the ‘friend of God’. His name means ‘father of many’. His story is the next stop on our journey.',
  },
};
export const mockCampaigns: CampaignItem[] = [
  {
    id: 1,
    title: 'Giving Tuesday',
    regions: '',
    window: '2025-12-19T02:58:00.000Z|2025-12-25T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 2,
    title: 'Christmas Campaign',
    regions:
      'CX, KE, UG, ZM, UK, US, AU, ZA, CA, IE, NZ, SG, MY, HK, TW, JP, KR, CN, IN, ID, PH, TH, VN, MY, HK, TW, JP, KR, CN, IN, ID, PH, TH, VN',
    window: '2025-12-24T02:58:00.000Z|2025-12-26T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 3,
    title: 'New Year Campaign',
    regions: 'CX, KE, UG, ZM, GB, US',
    window: '2026-01-01T02:58:00.000Z|2026-01-03T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 4,
    title: "Valentine's Day Campaign",
    regions:
      'CX, KE, UG, ZM, UK, US, AU, ZA, CA, IE, NZ, SG, MY, HK, TW, JP, KR, CN, IN, ID, PH, TH, VN, MY, HK, TW, JP, KR, CN, IN, ID, PH, TH, VN',
    window: '2026-02-14T02:58:00.000Z|2026-02-15T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 5,
    title: 'Easter Campaign',
    regions: 'CX, KE, UG, ZM',
    window: '2025-04-18T02:58:00.000Z|2025-04-21T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 6,
    title: 'Summer Campaign',
    regions: 'CX, KE, UG, ZM',
    window: '2026-06-01T02:58:00.000Z|2026-06-15T02:58:00.000Z',
    isPublished: false,
  },

  {
    id: 7,
    title: 'Back to School Boost',
    regions: 'KE, UG',
    window: '2025-01-10T02:58:00.000Z|2025-01-20T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 8,
    title: "Mother's Day Appreciation",
    regions: 'KE, ZM',
    window: '2025-05-11T02:58:00.000Z|2025-05-12T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 9,
    title: 'Mid-Year Clearance',
    regions: 'CX, UG',
    window: '2025-06-20T02:58:00.000Z|2025-06-30T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 10,
    title: 'Independence Day Specials',
    regions: 'CX, KE, UG',
    window: '2025-07-04T02:58:00.000Z|2025-07-06T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 11,
    title: 'August Flash Sale',
    regions: 'KE',
    window: '2025-08-10T02:58:00.000Z|2025-08-12T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 12,
    title: 'Customer Appreciation Week',
    regions: 'CX, KE, UG, ZM',
    window: '2025-09-05T02:58:00.000Z|2025-09-12T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 13,
    title: 'End of Quarter Rewards',
    regions: 'UG, ZM',
    window: '2025-09-27T02:58:00.000Z|2025-09-30T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 14,
    title: 'October Savings Sprint',
    regions: 'CX, KE',
    window: '2025-10-10T02:58:00.000Z|2025-10-17T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 15,
    title: 'Black Friday Deals',
    regions: 'CX, KE, UG, ZM',
    window: '2025-11-28T02:58:00.000Z|2025-12-01T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 16,
    title: 'Cyber Monday Blitz',
    regions: 'KE, UG, ZM',
    window: '2025-12-01T02:58:00.000Z|2025-12-03T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 17,
    title: 'Holiday Warm-up',
    regions: 'CX, ZM',
    window: '2025-12-10T02:58:00.000Z|2025-12-17T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 18,
    title: 'January Kickoff',
    regions: 'KE, UG',
    window: '2026-01-05T02:58:00.000Z|2026-01-10T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 19,
    title: 'Payday Weekend',
    regions: 'CX, KE, UG',
    window: '2026-01-29T02:58:00.000Z|2026-02-01T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 20,
    title: "Women's Day Spotlight",
    regions: 'KE, ZM',
    window: '2026-03-08T02:58:00.000Z|2026-03-09T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 21,
    title: 'March Madness Rewards',
    regions: 'CX, KE, UG, ZM',
    window: '2026-03-15T02:58:00.000Z|2026-03-22T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 22,
    title: 'Quarterly Wrap-up',
    regions: 'UG',
    window: '2025-03-30T02:58:00.000Z|2025-04-05T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 23,
    title: 'Earth Day Green Deals',
    regions: 'CX, KE',
    window: '2026-04-22T02:58:00.000Z|2026-04-23T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 24,
    title: 'May Mega Sale',
    regions: 'KE, UG, ZM',
    window: '2026-05-01T02:58:00.000Z|2026-05-07T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 25,
    title: 'June Fest',
    regions: 'CX, ZM',
    window: '2025-06-15T02:58:00.000Z|2025-06-20T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 26,
    title: 'Back-to-School 2027',
    regions: 'CX, KE, UG',
    window: '2026-08-15T02:58:00.000Z|2026-08-31T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 27,
    title: 'Customer Loyalty Bonus',
    regions: 'KE, UG',
    window: '2026-09-10T02:58:00.000Z|2026-09-17T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 28,
    title: 'October Boost Week',
    regions: 'UG, ZM',
    window: '2026-10-01T02:58:00.000Z|2026-10-05T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 29,
    title: 'Singles Day 11.11',
    regions: 'CX, KE, UG, ZM',
    window: '2026-11-11T02:58:00.000Z|2026-11-12T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 30,
    title: 'December Doorbusters',
    regions: 'KE',
    window: '2024-12-05T02:58:00.000Z|2024-12-12T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 31,
    title: 'New Year Countdown',
    regions: 'CX, KE, UG',
    window: '2025-12-28T02:58:00.000Z|2025-12-31T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 32,
    title: 'Anniversary Celebration',
    regions: 'CX, ZM',
    window: '2025-01-15T02:58:00.000Z|2025-01-20T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 33,
    title: 'Valentine Week Warmup',
    regions: 'KE, UG, ZM',
    window: '2025-02-07T02:58:00.000Z|2025-02-14T02:58:00.000Z',
    isPublished: false,
  },
  {
    id: 34,
    title: 'March Rewards Week',
    regions: 'CX, KE, UG, ZM',
    window: '2025-03-20T02:58:00.000Z|2025-03-27T02:58:00.000Z',
    isPublished: true,
  },
  {
    id: 35,
    title: '',
    regions: '',
    window: '',
    isPublished: false,
  },
];
