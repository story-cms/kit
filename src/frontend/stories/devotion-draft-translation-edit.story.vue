<template>
  <Story title="Devotion Draft Translation Edit" group="stories">
    <Variant title="Details tab" :setup-app="loadDetails">
      <ChapterDraftEdit
        :is-translation="true"
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="spanish"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftTranslationBundle"
        :source="sampleDevotionDraftSourceBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Blocks tab" :setup-app="loadBlocks">
      <ChapterDraftEdit
        :is-translation="true"
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="spanish"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftTranslationBundle"
        :source="sampleDevotionDraftSourceBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Spurgeon devotion · German" :setup-app="loadGermanDevotion">
      <ChapterDraftEdit
        :is-translation="true"
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="german"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :draft="realisticDevotionDraft"
        :bundle="germanDevotionBundle"
        :source="englishDevotionBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>

    <Variant title="Validation errors on tabs" :setup-app="loadValidationErrors">
      <ChapterDraftEdit
        :is-translation="true"
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="spanish"
        :errors="devotionDraftEditValidationErrors"
        :bookmarks="sharedProps.bookmarks"
        :draft="sampleDevotionDraft"
        :bundle="sampleDevotionDraftTranslationBundle"
        :source="sampleDevotionDraftSourceBundle"
        :story="devotionDraftEditStory"
        :available-resources="availableResources"
        :has-edit-review="false"
        :last-published="''"
        :providers="mockResourceProviders"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ChapterDraftEdit from './chapter-draft-edit.vue';
import {
  availableResources,
  devotionDraftEditStory,
  devotionDraftEditValidationErrors,
  mockResourceProviders,
  sampleDevotionDraft,
  sampleDevotionDraftSourceBundle,
  sampleDevotionDraftTranslationBundle,
  sharedProps,
  spanish,
  german,
  miniSidebar,
} from '../test/mocks';
import { useModelStore, useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';
import type { ChapterDraftEditBundle } from '../../types';

const realisticDevotionDraft = {
  ...sampleDevotionDraft,
  number: 7,
};

const devotionVisibility = () => ({
  presenter: true,
  personal: true,
  inNavigation: true,
  hidden: false,
});

const englishDevotionBundle: ChapterDraftEditBundle = {
  ...sampleDevotionDraftSourceBundle,
  number: '07',
  title: 'Looking Unto Jesus',
  description:
    "A structured devotion adapted from C. H. Spurgeon's June 28 morning reading in Morning and Evening.",
  blocks: [
    {
      id: 'spurgeon-title',
      kind: 'title',
      blockName: "Today's Devotion",
      title: 'Looking Unto Jesus',
      subtitle: 'The author and finisher of our faith',
      coverImage:
        'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
      visibility: devotionVisibility(),
    },
    {
      id: 'spurgeon-scripture',
      kind: 'scripture',
      blockName: 'Scripture',
      displayName: 'Run with Your Eyes on Jesus',
      scripture: {
        reference: 'Hebrews 12:1–2',
        verse:
          'Lay aside every weight and run with endurance the race before you, looking to Jesus, the author and finisher of faith, who endured the cross and is seated at the right hand of God.',
      },
      leadersNotes: '',
      showLeadersNotes: false,
      visibility: devotionVisibility(),
    },
    {
      id: 'spurgeon-reflection-one',
      kind: 'content',
      blockName: 'Morning Reflection',
      displayName: 'Turn Your Eyes from Yourself',
      blockRole: 'commentary',
      style: 'primary',
      content:
        "Spurgeon reminds us that the Holy Spirit turns our eyes away from ourselves and toward Jesus. We are tempted to inspect our faith, measure our feelings, or depend on yesterday's experience. None of these can carry the weight of our hope. Christ can.\n\nPeace does not grow from looking harder at ourselves. It grows as we look again to the One who began our faith and will bring it to completion.",
      items: [],
      leadersNotes: '',
      showLeadersNotes: false,
      visibility: devotionVisibility(),
    },
    {
      id: 'spurgeon-reflection-two',
      kind: 'content',
      blockName: 'Deeper Reflection',
      displayName: 'Keep Christ Before You',
      blockRole: 'reflection',
      style: 'secondary',
      content:
        "Bring Christ's death, suffering, grace, glory, and intercession freshly to mind. Look to him when guilt accuses you, when weakness discourages you, and when success tempts you to trust yourself.\n\n**Practice:** Name one burden you have been staring at. Then name one truth about Jesus that is greater than that burden.",
      items: [],
      leadersNotes: '',
      showLeadersNotes: false,
      visibility: devotionVisibility(),
    },
    {
      id: 'spurgeon-discussion',
      kind: 'content',
      blockName: 'Discuss',
      displayName: 'Questions for Reflection',
      blockRole: 'reflection',
      style: 'secondary',
      content:
        "1. When you feel spiritually uncertain, where do your eyes usually turn first?\n2. What is the difference between trusting your faith and trusting Jesus?\n3. Which part of Christ's work gives you courage for today?\n4. What would it look like to keep Jesus before you from morning until evening?",
      items: [],
      leadersNotes:
        'Invite people to answer one question rather than rushing through all four. Leave room for silence and honest uncertainty.',
      showLeadersNotes: true,
      visibility: devotionVisibility(),
    },
    {
      id: 'spurgeon-morning-prayer',
      kind: 'content',
      blockName: 'Morning Prayer',
      displayName: 'Fix My Eyes on You',
      blockRole: 'prayer',
      style: 'tertiary',
      content:
        'Lord Jesus, as this day begins, turn my attention away from fear, pride, and self-reliance. Keep your cross, your grace, and your faithful presence before me. Teach me to run today with my eyes fixed on you. Amen.',
      items: [],
      leadersNotes: '',
      showLeadersNotes: false,
      visibility: devotionVisibility(),
    },
    {
      id: 'spurgeon-evening-prayer',
      kind: 'content',
      blockName: 'Evening Prayer',
      displayName: 'Rest in the Finisher of Faith',
      blockRole: 'prayer',
      style: 'tertiary',
      content:
        'Lord Jesus, as this day closes, I place both my failures and my unfinished work into your hands. Thank you that my hope rests in your finished work, not my perfect performance. Keep my heart in your peace tonight. Amen.',
      items: [],
      leadersNotes: '',
      showLeadersNotes: false,
      visibility: devotionVisibility(),
    },
  ],
};

const germanDevotionBundle: ChapterDraftEditBundle = {
  ...englishDevotionBundle,
  title: 'Auf Jesus schauen',
  description:
    'Eine strukturierte Andacht nach C. H. Spurgeons Morgenlesung vom 28. Juni aus Morning and Evening.',
  blocks: [
    {
      ...englishDevotionBundle.blocks[0],
      kind: 'title',
      blockName: 'Heutige Andacht',
      title: 'Auf Jesus schauen',
      subtitle: 'Den Anfänger und Vollender unseres Glaubens',
    },
    {
      ...englishDevotionBundle.blocks[1],
      kind: 'scripture',
      blockName: 'Bibeltext',
      displayName: 'Mit dem Blick auf Jesus laufen',
      scripture: {
        reference: 'Hebräer 12,1–2',
        verse:
          'Legt jede Last ab und lauft mit Ausdauer in dem Wettlauf, der vor euch liegt. Schaut dabei auf Jesus, den Anfänger und Vollender des Glaubens, der das Kreuz erduldete und nun zur Rechten Gottes sitzt.',
      },
    },
    {
      ...englishDevotionBundle.blocks[2],
      kind: 'content',
      blockName: 'Morgenbetrachtung',
      displayName: 'Wende den Blick von dir selbst ab',
      content:
        'Spurgeon erinnert uns daran, dass der Heilige Geist unseren Blick von uns selbst weg und auf Jesus richtet. Wir sind versucht, unseren Glauben zu prüfen, unsere Gefühle zu messen oder uns auf die Erfahrungen von gestern zu verlassen. Nichts davon kann unsere Hoffnung tragen. Christus kann es.\n\nFrieden wächst nicht dadurch, dass wir uns selbst genauer betrachten. Er wächst, wenn wir wieder auf den schauen, der unseren Glauben begonnen hat und ihn vollenden wird.',
    },
    {
      ...englishDevotionBundle.blocks[3],
      kind: 'content',
      blockName: 'Vertiefung',
      displayName: 'Behalte Christus vor Augen',
      content:
        'Rufe dir Christi Tod, Leiden, Gnade, Herrlichkeit und Fürsprache neu ins Gedächtnis. Schau auf ihn, wenn Schuld dich anklagt, wenn Schwäche dich entmutigt und wenn Erfolg dich dazu verleitet, dir selbst zu vertrauen.\n\n**Übung:** Benenne eine Last, auf die du ständig schaust. Benenne dann eine Wahrheit über Jesus, die größer ist als diese Last.',
    },
    {
      ...englishDevotionBundle.blocks[4],
      kind: 'content',
      blockName: 'Gespräch',
      displayName: 'Fragen zum Nachdenken',
      content:
        '1. Wohin richtet sich dein Blick zuerst, wenn du geistlich unsicher wirst?\n2. Was ist der Unterschied zwischen dem Vertrauen auf deinen Glauben und dem Vertrauen auf Jesus?\n3. Welcher Teil des Werkes Christi gibt dir heute Mut?\n4. Wie könnte es aussehen, Jesus vom Morgen bis zum Abend vor Augen zu behalten?',
      leadersNotes:
        'Laden Sie dazu ein, eine Frage zu beantworten, anstatt alle vier schnell durchzugehen. Lassen Sie Raum für Stille und ehrliche Unsicherheit.',
    },
    {
      ...englishDevotionBundle.blocks[5],
      kind: 'content',
      blockName: 'Morgengebet',
      displayName: 'Richte meinen Blick auf dich',
      content:
        'Herr Jesus, wenn dieser Tag beginnt, wende meine Aufmerksamkeit von Angst, Stolz und Selbstvertrauen ab. Halte mir dein Kreuz, deine Gnade und deine treue Gegenwart vor Augen. Lehre mich, heute mit dem Blick auf dich zu laufen. Amen.',
    },
    {
      ...englishDevotionBundle.blocks[6],
      kind: 'content',
      blockName: 'Abendgebet',
      displayName: 'Ruhe beim Vollender des Glaubens',
      content:
        'Herr Jesus, wenn dieser Tag zu Ende geht, lege ich sowohl mein Versagen als auch meine unerledigte Arbeit in deine Hände. Danke, dass meine Hoffnung auf deinem vollbrachten Werk ruht und nicht auf meiner vollkommenen Leistung. Bewahre mein Herz heute Nacht in deinem Frieden. Amen.',
    },
  ],
};

const loadTranslationModel: StoryHandler = (): void => {
  const store = useModelStore();
  store.setModel({ ...sampleDevotionDraftTranslationBundle });
  store.setSource({ ...sampleDevotionDraftSourceBundle });
};

const loadDetails: StoryHandler = (context): void => {
  miniSidebar(context);
  loadTranslationModel(context);
  const url = new URL(window.location.href);
  url.searchParams.delete('tab');
  window.history.replaceState({}, '', url.toString());
};

const loadBlocks: StoryHandler = (context): void => {
  miniSidebar(context);
  loadTranslationModel(context);
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Blocks');
  window.history.replaceState({}, '', url.toString());
};

const loadGermanDevotion: StoryHandler = (context): void => {
  miniSidebar(context);
  const store = useModelStore();
  store.setModel({ ...germanDevotionBundle });
  store.setSource({ ...englishDevotionBundle });
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Blocks');
  window.history.replaceState({}, '', url.toString());
};

const loadValidationErrors: StoryHandler = (context): void => {
  miniSidebar(context);
  loadTranslationModel(context);
  useSharedStore().setErrors(devotionDraftEditValidationErrors);
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Blocks');
  window.history.replaceState({}, '', url.toString());
};
</script>

<docs lang="md">
# Devotion Draft Translation Edit

Side-by-side devotion draft translation editor with Details, Blocks, and Resources tabs. Includes audio in Details and a seven-block English/German devotion adapted from C. H. Spurgeon's public-domain [June 28 morning reading in _Morning and Evening_](https://ccel.org/ccel/spurgeon/morneve.d0628am.html), with Scripture, reflections, discussion questions, and morning and evening prayers.
</docs>
