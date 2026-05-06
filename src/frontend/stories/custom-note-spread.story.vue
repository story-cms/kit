<template>
  <Story title="Custom note & spread (John episode)" group="stories">
    <Variant title="Translation layout" :setup-app="miniSidebar">
      <TranslationIndex
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="spanish"
        :languages="sharedProps.languages"
        :errors="sharedProps.errors"
        :draft="draft"
        :bundle="bundle"
        :source="source"
        :providers="{}"
        :last-published="'2021-10-10T14:48:00.000000Z'"
        :story="{
          ...story,
          fields: johnFields,
          chapterLimit: 21,
        }"
        :has-edit-review="false"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import TranslationIndex from './translation-index.vue';
import { sharedProps, miniSidebar, spanish, story } from '../test/mocks';
import type { FieldSpec } from '../../types';

/** Episode schema: header panel, foldable `spreads` with `spread` + note lists, summary blocks. */
const johnFields: FieldSpec[] = [
  {
    name: 'episodeHeader',
    label: '',
    widget: 'panel',
    fields: [
      {
        label: 'Title',
        name: 'title',
        widget: 'string',
      },
      {
        name: 'episodeMedia',
        label: '',
        widget: 'panel',
        isRow: true,
        fields: [
          {
            label: 'Cover Image',
            name: 'imageUrl',
            widget: 'image',
            uploadPreset: 'episodes',
            description: 'SVG, PNG, JPG, GIF up to 5MB',
            extensions: ['.jpeg', '.jpg', '.png', '.svg'],
            maxSize: 5662310,
          },
          {
            label: 'Animation File',
            name: 'animationUrl',
            widget: 'animation',
            uploadPreset: 'episodes',
            description: 'RIV only',
            extensions: ['.riv'],
            maxSize: 2000000,
          },
        ],
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
        toolbar: [],
      },
    ],
  },

  {
    label: 'Spread',
    name: 'spreads',
    widget: 'list',
    index: 'title',
    canFold: true,
    fields: [
      {
        label: '',
        name: 'custom',
        widget: 'spread',
      },

      {
        label: 'Notes',
        name: 'notes',
        widget: 'list',
        isFlexible: true,
        index: 'type',
        fields: [
          {
            label: '',
            name: 'custom',
            widget: 'note',
          },
        ],
      },
    ],
  },

  {
    label: 'Summary Introduction',
    name: 'summaryIntro',
    widget: 'markdown',
    minimal: true,
  },
  {
    label: 'Summary Statement',
    name: 'conclusions',
    widget: 'list',
    fields: [
      {
        label: 'Summary Statement',
        name: 'statement',
        widget: 'string',
      },
      {
        label: 'Scripture Excerpt',
        name: 'excerpt',
        widget: 'markdown',
        minimal: true,
        toolbar: ['superscript'],
      },
    ],
  },
  {
    label: 'To Think About',
    name: 'reflection',
    widget: 'string',
  },
  {
    label: 'Next Up',
    name: 'nextUp',
    widget: 'string',
  },
  {
    label: 'Recap',
    name: 'recap',
    widget: 'markdown',
    minimal: true,
  },
  {
    label: 'Recap To Think About',
    name: 'recapToThinkAbout',
    widget: 'markdown',
    minimal: true,
    toolbar: [],
  },
];

const placeholderImage =
  'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg';
const placeholderRive =
  'https://res.cloudinary.com/onesheep/raw/upload/v1685641667/cmsplayground/fnu2m4ogxi9wdhi91iqi.riv';

const source = {
  title: 'The Word Became Flesh',
  imageUrl: placeholderImage,
  animationUrl: placeholderRive,
  part: 1,
  passage: {
    reference: 'John 1:1-5',
    verse:
      '`1` In the beginning was the Word, and the Word was with God, and the Word was God. `2` He was with God in the beginning. `3` Through him all things were made; without him nothing was made that has been made.',
  },
  intro:
    '## The Word Became Flesh\n\n' +
    'In the beginning was the Word. John does not ease us in with anecdote or scenery; he opens at the widest possible angle — *before* creation, *before* Israel’s story, *before* arguments can cluster around us.\n\n' +
    'This episode lingers in the opening verses on purpose. We are not trying to win a debate about Greek vocabulary in one sitting; we are trying to let the text set the room’s temperature.\n\n' +
    'When John repeats “in the beginning,” thoughtful readers hear Genesis. The Bible’s first book begins the same way, but with a different kind of light on the canvas. Watch how John rhymes with that memory without merely copying it.\n\n' +
    'The Word is not presented as an idea that occasionally visits religious minds. John presses something more startling: this Word was *with* God, and this Word *was* God — language that demands slow chewing, not quick summarizing.\n\n' +
    'For facilitators: invite the group to read aloud, more than once, and to notice where their breathing changes. Sometimes theology is not first an answer but an atmosphere that makes honesty possible.\n\n' +
    'We will return, in later episodes, to life and light and the world’s responses. Here, stay inside the pressure of identity: not *a* word among many, but *the* Word that names God’s self-utterance.\n\n' +
    'If you are translating, resist polishing John into smooth modern prose. His Greek is lean and musical; let your English carry a little austerity — enough to make the listener lean in.\n\n' +
    'Finally, treat the introduction as an invitation to humility. We are not mastering John; we are being addressed by him — and, through him, by the one he will soon name as full of grace and truth.',
  spreads: [
    {
      type: 'scripture' as const,
      scripture: {
        reference: 'John 1:1',
        verse:
          '`1` In the beginning was the Word, and the Word was with God, and the Word was God.',
      },
      title: 'John 1:1',
      subtitle: 'The Word with God',
      callout: 'Read slowly',
      notes: [
        {
          type: 'comment' as const,
          content:
            'Read John 1:1 three times slowly. After each reading, write one sentence: what single image or claim stayed with you?\n\n' +
            'Notice the sequence: *was* … *was with* … *was*. How does order shape meaning? Would the verse land the same if John rearranged the clauses?\n\n' +
            'What do you feel when you hear **with** God — closeness, dialogue, mutuality, tension? Try not to rush to a systematic definition on the first pass.\n\n' +
            'Compare your instinct about “Word” with how you use the word “word” in ordinary speech — promise, rumor, command, blessing. Which of those resonances is closest here?\n\n' +
            'Where in your life do you most want language you can trust — in relationships, institutions, your own inner narration? Let that longing sit beside the text without forcing a lesson.\n\n' +
            'If someone in the group is new to the Bible, offer a gentle reminder: the goal tonight is not performance but attention. Confusion voiced kindly is still faithfulness.\n\n' +
            'Close by sharing one honest question you are carrying into the next episode — not to solve it, but to keep it in the room like an open window.',
        },
        {
          type: 'definition' as const,
          content:
            '**Logos** (Greek): a dense term with a long cultural history — speech, rational order, argument, even the intelligibility of reality. John borrows a word that already hums before he speaks.\n\n' +
            'In Jewish ears, “word” also echoes God’s creative speech in the Old Testament — God speaks, and reality answers. John’s opening aligns Jesus with that formative pattern.\n\n' +
            'In some philosophical circles, *logos* could sound abstract, almost cosmic machinery. John does not subtract the cosmic scope, but he refuses to leave it abstract for long.\n\n' +
            'English translations choose between **Word**, **Word of God**, or occasionally **Message**. Each choice lights up slightly different corners of meaning; compare versions when you study.\n\n' +
            'John’s genius is narrative, not slogans: he begins at altitude, then descends toward streets and rivers and dinners and a cross. The definition that matters most arrives in the story’s movement.\n\n' +
            'When teaching, distinguish between glossary work and worship. A crisp note about Greek can serve love — or it can become a fence. Let the definition open doors, not lock them.\n\n' +
            'If you use study Bibles or commentaries, treat them as conversation partners, not umpires. Let John’s text keep the final voice in the room.\n\n' +
            'Return to this note after you read further in the chapter; *logos* will pick up new colors once life, light, and witness enter the stage — colors you cannot fully predict from verse one alone.\n\n' +
            'A practical habit: keep a running list of synonyms your community discovers together — not to reduce John, but to stretch your imagination toward his breadth.\n\n' +
            'Finally, remember definition is a servant of encounter. If the term becomes only clever, you have traded fire for fireworks. Go back to the text until the words feel personal again.',
        },
        {
          type: 'definition' as const,
          content:
            'A practical habit: keep a running list of synonyms your community discovers together — not to reduce John, but to stretch your imagination toward his breadth.\n\n' +
            'Finally, remember definition is a servant of encounter. If the term becomes only clever, you have traded fire for fireworks. Go back to the text until the words feel personal again.',
        },
      ],
    },
    {
      type: 'stopAndThink' as const,
      title: 'Light in darkness',
      subtitle: 'Where do you long for light this week?',
      notes: [
        {
          type: 'reflection' as const,
          content:
            'Set a timer for sixty seconds. Silence your explanations. Let the room be plain — dishes, traffic, breath — and stay inside it without fixing anything.\n\n' +
            'Name, privately, one place where you feel dimmed lately. Not to dramatize it, but to stop pretending the shadow is only “out there.”\n\n' +
            'Whisper a single sentence of permission: it is allowed to be unfinished. Faith is not a quiz you must pass before you are allowed to need God.\n\n' +
            'If your mind races toward solutions, notice the rush with curiosity rather than shame. Speed is often fear wearing a uniform.\n\n' +
            'Imagine light as patient — not frantic, not scolding. What changes in your body when you picture God’s attention that way?\n\n' +
            'Write down one small kindness you could receive this week: a walk, a phone call, an earlier bedtime. Let desire be honest, not heroic.\n\n' +
            'When the minute ends, do not force a cheerful ending. Carry the quiet into the next section like a cup of water — simple, necessary, enough for now.\n\n' +
            'If you journal, capture one line only: “Today I noticed _____.” Leave the blank uncomfortably specific.\n\n' +
            'Remember: reflection is not performance. God is not grading your interior monologue; God is near.\n\n' +
            'Before you continue reading, stretch your shoulders once. Embodied small resets can be a kind of prayer — especially on long screens-and-scroll days.\n\n' +
            'Return to John’s text when you are ready, not when you feel enlightened. The Gospel welcomes you as you are, not as you pretend to be.\n\n' +
            'Close by breathing out slowly three times, naming no agenda — only space for the next words to arrive.',
        },
      ],
    },
  ],
  summaryIntro:
    'John’s opening lines are not decorative padding before “real” narrative begins; they aim the reader’s compass toward who Jesus is and what kind of world this is.\n\n' +
    'If creation is made *through* the Word, then nothing we touch is spiritually neutral — not labor, not art, not pain, not joy. The universe is not a warehouse of accidents.\n\n' +
    'At the same time, John’s solemn beginning refuses cheap triumphalism. Great claims invite great humility: we are still near the threshold.\n\n' +
    'For teachers planning a series, treat the prologue as something you return to rather than exhaust. It will echo differently after later scenes accumulate.\n\n' +
    'This summary is for orientation, not substitution. The community still needs the slow reading, the awkward silences, the questions that feel too big for one meeting.\n\n' +
    'Translation teams should coordinate tone across episodes: if chapter one sounds like a textbook, later stories will sound like melodrama — or vice versa. Seek consistent warmth and clarity.',
  conclusions: [
    {
      statement: 'Jesus is the eternal Word through whom all things hold together.',
      excerpt:
        '`3` Through him all things were made; without him nothing was made that has been made.\n\n' +
        'John anchors creation’s coherence in a person — not in a force we can privately customize. That move changes how we read both science and suffering.\n\n' +
        'If *nothing made* exists apart from the Word, then our lives are not owed an explanation before we are allowed to grieve or wonder.\n\n' +
        'The verse also doubles as a warning against spiritual ingratitude: every good structure we inherit — language, conscience, beauty — arrives as gift, not bootstraps.\n\n' +
        'Christian reflection has sometimes misused “everything” as a bludgeon. John’s point is not to silence questions, but to name the depth of dependence.\n\n' +
        'For artists and makers, the line can feel like blessing: labor participates in patterns begun before our ambition woke up.\n\n' +
        'For those crushed by futility, the line can feel cruel unless paired with the rest of John — grace is coming, even if it has not arrived in your paragraph yet.\n\n' +
        'Keep the superscript habit in translations that use verse numbers: they help listeners map public reading to personal study.\n\n' +
        'Memorize carefully — memory can become mercy when anxiety shouts louder than theology. Let the sentence be a handrail, not a trophy.\n\n' +
        'When you teach children, translate into wonder before you translate into argument. Awe is often the first theology.\n\n' +
        'Finally, read onward: creation-language in John is prologue to incarnation-language — and incarnation is where abstraction learns a human address.',
    },
  ],
  reflection: 'Where do you hear God speaking in your ordinary routines?',
  nextUp: 'The Word made flesh — living among us',
  recap:
    'We stayed close to John’s starting point: not a gentle anecdote, but a cosmic claim spoken with restrained language.\n\n' +
    'The group rehearsed what it means that the Word *was* — existence before our explanations arrive, a stability older than our moods.\n\n' +
    'We paused on *with God*, letting relational language do its work without forcing it into a diagram too small for the text.\n\n' +
    'We touched the bold clause *was God*, acknowledging how quickly curiosity can become either avoidance or combat; neither is the only option.\n\n' +
    'We heard Genesis echo in the phrase “in the beginning,” and let that echo widen the space rather than trap us in proof-text boxing.\n\n' +
    'We practiced slow reading as hospitality: newcomers were invited to observe aloud without performing expertise.\n\n' +
    'We named places where modern life trains us to treat words as disposable — and wondered what healing might come from treating language as sacred again.\n\n' +
    'We compared translation choices, not to score points, but to notice how English (and every language) tilts the light.\n\n' +
    'We made space for doubt voiced without swagger — honest uncertainty belongs in rooms where God is worshiped, not only in skeptic blogs.\n\n' +
    'We emphasized that John’s opening is prologue, not the whole story: compassion for listeners who feel overwhelmed by density.\n\n' +
    'We closed with a brief silence, letting the claims settle the way rain settles dust — quietly, without a speech.',
  recapToThinkAbout:
    'Before you sleep, write one sentence that names what you want morning-you to remember — not a slogan, but something concrete.\n\n' +
    'If the sentence feels silly, keep it anyway; sincerity is not the same as eloquence.\n\n' +
    'If the sentence feels sharp, ask whether it is true or only anxious. Edit once for honesty, not for polish.\n\n' +
    'Read your sentence aloud. Notice whether your shoulders tighten; curiosity can live next to fear without surrendering to it.\n\n' +
    'Share the line with one trusted person if you can — community turns private insight into shared courage.\n\n' +
    'If you cannot share it, place it somewhere you will see tomorrow: note app, margins, mirror margin in pencil.\n\n' +
    'Return to John 1:1 this week at least twice — not to master it, but to let it recognize you in different moods.\n\n' +
    'End with gratitude for any moment today when language did not fail you — a kind word, a clear apology, a prayer that fit.\n\n' +
    'When you wake, read your sentence before the feed. Let one quiet line compete with the noise — you are training attention, not achieving perfection.\n\n' +
    'Remember the goal is not a perfect week but a truer one — small returns, gentle repairs, God meeting you in ordinary words.',
};

const bundle = {
  title: 'El Verbo se hizo carne',
  imageUrl: placeholderImage,
  animationUrl: placeholderRive,
  part: 1,
  passage: {
    reference: 'John 1:1-5',
    verse:
      '`1` En el principio era el Verbo, y el Verbo estaba con Dios, y el Verbo era Dios. `2` El estaba en el principio con Dios. `3` Todas las cosas por él fueron hechas, y sin él nada de lo que ha sido hecho fue hecho.',
  },
  intro:
    '## El Verbo se hizo carne\n\n' +
    'En el principio era el Verbo. Juan no nos abre con anécdota folclórica ni con paisaje costumbrista; abre en el ángulo más amplio — *antes* de la creación narrada, *antes* del relato de Israel, *antes* de que nuestros debates se instalen en la mesa.\n\n' +
    'Este episodio se detiene en los primeros versículos a propósito. No pretendemos agotar en una sola reunión cada matiz del griego ni cada línea de la historia de la interpretación; queremos dejar que el texto fije la temperatura del lugar.\n\n' +
    'Cuando Juan repite “en el principio,” el lector atento escucha un eco de Génesis. El primer libro de la Biblia comienza con la misma frase, pero con una luz distinta proyectada sobre el lienzo. Observa cómo Juan hace rima con esa memoria sin limitarse a copiarla.\n\n' +
    'El Verbo no se presenta como una idea que visita de vez en cuando a personas religiosas. Juan insiste en algo más sobresaliente: este Verbo **estaba con** Dios, y este Verbo **era** Dios — un lenguaje que pide masticación lenta, no resumen apresurado.\n\n' +
    'Para quien facilita: invita a leer en voz alta más de una vez y a notar dónde cambia la respiración del grupo. A veces la teología no es primero una respuesta sino un ambiente que hace posible la honestidad.\n\n' +
    'Más adelante volveremos a *vida* y *luz* y a las respuestas del mundo. Aquí, permanece dentro de la presión de la identidad: no *una* palabra entre muchas, sino *el* Verbo que nombra la autocomunicación de Dios.\n\n' +
    'Si traduces, evita pulir a Juan en exceso hasta convertirlo en una prosa moderna demasiado relajada. Su griego es sobrio y musical; busca un español con un poco de austeridad — lo bastante para que el oído se incline hacia adelante.\n\n' +
    'Trata la introducción como invitación a la humildad hermenéutica: no dominar a Juan, sino dejarse interpelar por él — y, a través de él, por aquel a quien pronto nombrará lleno de gracia y de verdad.\n\n' +
    'Cierra la lectura inicial con una pregunta abierta que el grupo pueda llevarse sin obligación de cerrarla hoy: ¿qué palabra humana —promesa, mentira, consuelo, mandato— ocupa demasiado trono en tu vida esta semana?\n\n' +
    'Finalmente, anuncia con claridad el ritmo del curso: capítulos densos se merecen silencios largos; premia la atención sostenida más que la velocidad de consumo.',
  spreads: [
    {
      type: 'scripture' as const,
      scripture: {
        reference: 'John 1:1',
        verse:
          '`1` En el principio era el Verbo, y el Verbo estaba con Dios, y el Verbo era Dios.',
      },
      title: 'Juan 1:1',
      subtitle: 'El Verbo con Dios — permanencia, intimidad y identidad',
      callout:
        'Lectura lenta, en voz baja si es posible. Marca pausas después de “era”, después de “con Dios”, después de “era Dios”. ' +
        'No se trata de teatro, sino de dejar que el oído reconozca el ritmo que Juan construye.',
      notes: [
        {
          type: 'comment' as const,
          content:
            'Lee Juan 1:1 tres veces, despacio. Después de cada lectura, escribe una sola frase: ¿qué imagen o afirmación permaneció contigo?\n\n' +
            'Observa la secuencia: *era* … *estaba con* … *era*. ¿El orden moldea el sentido? ¿Aterrizaría igual el versículo si Juan permutara las cláusulas?\n\n' +
            '¿Qué te ocurre al oír **con** Dios — cercanía, diálogo, reciprocidad, tensión santa? Evita imponer en el primer paso una definición sistemática completa.\n\n' +
            'Compara tu instinto sobre “Verbo” con usos cotidianos de *palabra* — promesa, rumor, instrucción, bendición. ¿Qué resonancia se acerca más?\n\n' +
            '¿En qué ámbitos de la vida más anhelas lenguaje confiable — relaciones, instituciones, la narración interior—? Deja esa sed junto al texto sin forzar moraleja.\n\n' +
            'Si hay personas nuevas en la Biblia, recuerda con ternura: el objetivo de la noche no es brillar, sino prestar atención. La confusión honesta sigue siendo fidelidad.\n\n' +
            'Invita a marcar diferencias entre lectura privada y lectura comunitaria: ambas valen; cada una enseña algo que la otra no alcanza sola.\n\n' +
            'Pregunta por el trasfondo: ¿qué “principio” evoca tu memoria bíblica — creación, pacto, exilio, regreso? No busques unanimidad inmediata.\n\n' +
            'Si aparece el temor a equivocarse, nómbralo sin vergüenza tóxica. Las preguntas mal formuladas a veces abren puertas que las respuestas impacientes cierran.\n\n' +
            'Cierra compartiendo **una** pregunta que llevarás al próximo episodio — no para resolverla ya, sino para dejarla en la mesa como ventana abierta.\n\n' +
            'Repite en voz baja, como oración colegida: Señor, enseñanos a escuchar antes de explicarte.',
        },
        {
          type: 'definition' as const,
          content:
            '**Logos** (λόγος, griego): término denso con historia cultural amplia — habla, orden racional, argumento, a veces hasta la inteligibilidad misma de lo real. Juan retoma una palabra que ya vibra antes de que él hable.\n\n' +
            'En oídos judíos, “palabra” evoca también el habla creadora del Antiguo Testamento — Dios habla y la realidad responde. La apertura de Juan alinea a Jesús con ese patrón formativo.\n\n' +
            'En algunos círculos filosóficos, *logos* podía sonar abstracto — casi maquinaria cósmica. Juan no borra el alcance cósmico, pero no lo deja flotando en el aire por mucho tiempo.\n\n' +
            'Las traducciones al español eligen entre **Verbo**, **Palabra** u otras soluciones. Cada opción ilumina matices distintos; compara versiones cuando estudies en grupo.\n\n' +
            'El genio de Juan es narrativo, no esloganero: comienza en altitud y desciende hacia calles, ríos, mesas y cruz. La definición definitiva llega con el movimiento del relato.\n\n' +
            'Al enseñar, distingue entre glosario y adoración. Una nota clara sobre griego puede servir al amor — o convertirse en verja. Que la definición abra paso, no lo cierre.\n\n' +
            'Si usas comentarios o biblias de estudio, trátalos como interlocutores, no árbitros absolutos. El texto de Juan merece la última voz en la habitación.\n\n' +
            'Vuelve a esta nota tras avanzar en el capítulo; *logos* ganará nuevos matices cuando aparezcan vida, luz y testimonio — matices que el versículo uno no agota.\n\n' +
            'Hábito práctico: lleva una lista creciente de sinónimos y metáforas que vuestro grupo descubra — no para reducir a Juan, sino para estirar la imaginación.\n\n' +
            'Recuerda: la definición sirve al encuentro. Si el término se vuelve solo ingenio, cambiaste fuego por fuegos artificiales. Regresa al texto hasta que vuelva a doler y consolar.\n\n' +
            'Para equipos de traducción, documenta en una línea por qué elegiste “Verbo” o “Palabra” aquí; el futuro tú te lo agradecerá cuando revises consistencia.\n\n' +
            'Cierra leyendo en comunidad el versículo una vez más — ahora con oídos ligeramente más educados, aunque no más dueños del misterio.',
        },
      ],
    },
    {
      type: 'stopAndThink' as const,
      title: 'Luz en medio de la oscuridad',
      subtitle:
        'Esta semana, ¿en qué habitación de tu vida sientes que la oscuridad aprieta el paso: trabajo, familia, salud, memoria, finanzas, propósito? ' +
        'Elige una sola palabra que nombre esa “sala” y llévala como recordatorio.',
      notes: [
        {
          type: 'reflection' as const,
          content:
            'Activa un cronómetro de sesenta segundos. Calla explicaciones. Permite que el espacio sea simple — platos, tráfico lejano, respiración — sin reparar todo de inmediato.\n\n' +
            'Nombra, en silencio interior, un sitio donde te sientes atenuado últimamente. No para dramatizar, sino para dejar de fingir que la penumbra es solo “afuera.”\n\n' +
            'Susurra un permiso breve: está permitido estar inconcluso. La fe no es un examen que debes aprobar antes de necesitar a Dios.\n\n' +
            'Si la mente corre a soluciones, observa la prisa con curiosidad antes que con vergüenza. La velocidad suele ser miedo con uniforme.\n\n' +
            'Imagina la luz paciente — no frenética, no regañona. ¿Qué cambia en el cuerpo cuando imaginas la atención de Dios así?\n\n' +
            'Escribe una sola bondad concreta que podrías recibir esta semana: un paseo, una llamada, acostarte más temprano. Que el deseo sea honesto, no heroico.\n\n' +
            'Al terminar el minuto, no fuerces un final triunfal. Llévate el silencio a la siguiente sección como vaso de agua — sencillo, necesario, suficiente por ahora.\n\n' +
            'Si escribes diario, registra solo una línea: “Hoy noté _____.” Deja el hueco incómodamente específico.\n\n' +
            'Recuerda: reflexionar no es actuar para una audiencia. Dios no califica tu monólogo interior; Dios está cerca.\n\n' +
            'Antes de seguir leyendo, estírate los hombros una vez. Los reseteos corporales pueden ser oración — sobre todo en jornadas largas frente a la pantalla.\n\n' +
            'Vuelve al texto de Juan cuando puedas, no cuando te sientas iluminado. El Evangelio te recibe como eres, no como aparentas ser.\n\n' +
            'Exhala lentamente tres veces, sin agenda — solo espacio para que lleguen las palabras siguientes.\n\n' +
            'Si la ansiedad aprieta, coloca una mano sobre el pecho y nombra en voz baja una verdad pequeña: “Todavía hay aire.” No es teología completa, pero a veces es unción.',
        },
      ],
    },
  ],
  summaryIntro:
    'Juan abre el Evangelio colocando a Jesús —el Verbo— en el centro de la creación y de la revelación. No es un prólogo ornamental antes de la “historia real”; orienta el compás interpretativo de todo lo que vendrá.\n\n' +
    'Si todas las cosas son hechas *por medio de él*, entonces poco en la experiencia humana queda fuera de significado teológico — trabajo, arte, dolor, gozo. El universo no es un depósito de accidentes indiferentes.\n\n' +
    'Al mismo tiempo, la solemnidad del comienzo rechaza triunfalismo barato. Grandes afirmaciones invitan a gran humildad: seguimos cerca del umbral.\n\n' +
    'Quien diseña una serie debería tratar el prólogo como lugar al que se vuelve: resonará distinto después de acumular escenas posteriores.\n\n' +
    'Este resumen orienta; no sustituye la lectura pausada, los silencios incómodos ni las preguntas demasiado grandes para una sola reunión.\n\n' +
    'Los equipos de traducción conviene coordinen el tono entre episodios: si el capítulo uno suena a manual enciclopédico y el capítulo doce a telenovela, la audiencia pierde confianza en la voz narrativa.\n\n' +
    'Cuiden también el ritmo oral: frases largas pueden ser bellas en papel y desbordar el aire en lectura pública — ensayen en voz alta antes de grabar.\n\n' +
    'Dejen espacio explícito para la oración breve al final del resumen; los resúmenes densos a veces olvidan convidar a descanso.\n\n' +
    'Si trabajan con audiencias multiculturales, anoten ejemplos locales que iluminen “principio” y “palabra” sin forzar equivalencias frágiles.\n\n' +
    'Recuerden: el objetivo pastoral no es impresionar con erudición sino ayudar a que la gente se atreva a confiar en el texto.\n\n' +
    'Antes de publicar, lean el resumen en voz baja una última vez: ¿suena a carta pastoral o a folleto corporativo? Ajusten el timbre.\n\n' +
    'Cierren el bloque con una invitación concreta — un versículo a memorizar, una pregunta para cena familiar, un himno — que ancle el resumen en la semana.\n\n' +
    'Finalmente, celebren el trabajo invisible: traducir teología con ternura es ministerio, aunque el micrófono no lleve vuestro nombre.',
  conclusions: [
    {
      statement:
        'Jesús es el Verbo eterno por medio del cual todas las cosas tienen coherencia y por quien Dios habla su “sí” definitivo al mundo.',
      excerpt:
        '`3` Todas las cosas por él fueron hechas, y sin él nada de lo que ha sido hecho fue hecho.\n\n' +
        'Juan fija la coherencia de la creación en una persona — no en una fuerza que podamos domesticar en privado. Eso altera la lectura tanto de la ciencia como del sufrimiento.\n\n' +
        'Si *nada hecho* existe aparte del Verbo, nuestras vidas no están obligadas a explicarse antes de que se nos permita llorar o maravillarnos.\n\n' +
        'El versículo funciona también como advertencia contra la ingratitud espiritual: todo orden bueno que heredamos —lenguaje, conciencia, belleza— llega como don, no como autoprotección.\n\n' +
        'La reflexión cristiana a veces manipuló “todas las cosas” como maza; el punto de Juan no es silenciar preguntas sino nombrar la profundidad de la dependencia.\n\n' +
        'Para artistas y artesanas, la línea suena a bendición: el labor participa en patrones anteriores a nuestra ambición despierta.\n\n' +
        'Para quienes se sienten aplastados por la futilidad, la frase puede sonar dura hasta que se yuxtapone con el resto de Juan — la gracia viene, aunque aún no haya llegado a vuestro párrafo.\n\n' +
        'Mantén el hábito de superíndices cuando la versión los usa: ayudan a mapear lectura pública y estudio personal sin fricción innecesaria.\n\n' +
        'Memoriza con cuidado — la memoria puede ser misericordia cuando la ansiedad grita más fuerte que la teología. Que la oración sea barandilla, no trofeo.\n\n' +
        'Al enseñar a niños, traduce primero a asombro antes que a discusión. El asombro es a menudo la primera teología sana.\n\n' +
        'Lee en voz alta pausando después de “por él” y después de “sin él”: el contraste enseña tanto como el diccionario.\n\n' +
        'Si preparas transmisión, evita música de fondo que compita con palabras teológicamente densas; el oído necesita espacio.\n\n' +
        'Finalmente, lee adelante: el lenguaje de creación en Juan es prólogo del lenguaje de encarnación — donde la abstracción aprende una dirección humana.',
    },
  ],
  reflection:
    '¿Dónde escuchas hoy la voz de Dios en lo ordinario —la mesa, el trayecto, el mensaje diferido, el cuidado de un niño, el trámite que te agota— ' +
    'y qué te impide reconocerla si no suena como “lo sobrenatural” de las películas?',
  nextUp:
    'Próximo episodio: el Verbo hecho carne — vida, habitación entre nosotros y la gloria revelada en lo frágil. ' +
    'Sugerimos releer Juan 1:14 con lápiz y tres subrayados: *carne*, *habitó*, *gloria*.',
  recap:
    'Nos quedamos cerca del punto de partida de Juan: no una anécdota suave, sino una afirmación cósmica dicha con lenguaje contenido.\n\n' +
    'Repetimos qué significa que el Verbo *era* —existencia previa a nuestras explicaciones, una firmeza más antigua que nuestros estados de ánimo.\n\n' +
    'Hicimos una pausa prolongada en *con Dios*, dejando que el lenguaje relacional trabajara sin forzarlo a caber en un diagrama reducido.\n\n' +
    'Razonamos con cuidado sobre *era Dios*, admitiendo que la curiosidad puede volverse evasión o polémica — y que ninguna de las dos es la única salida.\n\n' +
    'Escuchamos el eco de Génesis en “en el principio,” y dejamos que ese eco ensanchara el espacio en lugar de encerrarnos en ripostas de prueba textual.\n\n' +
    'Practicamos lectura lenta como hospitalidad: quien llega por primera vez puede observar en voz alta sin exhibir erudición.\n\n' +
    'Nombramos lugares donde la vida moderna entrena la palabra como objeto desechable — y fantaseamos con sanidades posibles si tratáramos el lenguaje como sagrado otra vez.\n\n' +
    'Comparamos opciones de traducción, no para sumar puntos, sino para notear cómo cada idioma inclina la luz.\n\n' +
    'Abrimos espacio a la duda sin cinismo — la incertidumbre honesta cabe en habitaciones donde se adora, no solo en blogs escépticos.\n\n' +
    'Subrayamos que el comienzo de Juan es prólogo, no historia completa: compasión para quienes se sienten abrumados por la densidad.\n\n' +
    'Recordamos que Juan no es un rompecabezas a resolver del todo antes de dormir, sino una voz que nos precede y nos interpela.\n\n' +
    'Hablamos del riesgo pastoral de reducir el texto a lemas — útiles a veces, traicioneros si sustituyen el relato.\n\n' +
    'Valoramos los gestos litúrgicos posibles — lecturas repetidas, silencios comunes — que anclan afirmaciones demasiado grandes para una sola emoción.\n\n' +
    'Cerramos con silencio breve, dejando que las afirmaciones se asienten como lluvia fina sobre polvo — en silencio, sin discurso forzado.',
  recapToThinkAbout:
    'Antes de dormir, escribe una oración que nombre lo que quieres que el “tú” de la mañana recuerde — no un eslogan, sino algo concreto.\n\n' +
    'Si la oración suene risible, consérvala; la sinceridad no exige retórica.\n\n' +
    'Si pica, pregúntate si es verdad o solo ansiedad. Edita una vez por honestidad, no por brillo.\n\n' +
    'Lee en voz alta. Observa si se tensan los hombros; la curiosidad puede convivir con el miedo sin rendirse a él.\n\n' +
    'Compártela con una persona de confianza si puedes — la comunidad vuelve insight privado en ánimo compartido.\n\n' +
    'Si no puedes compartirla, guárdala donde mañana la veas: nota, márgenes, espejo con lápiz liviano.\n\n' +
    'Relee Juan 1:1 al menos dos veces esta semana — no para dominarlo, sino para que te reconozca en distintos ánimos.\n\n' +
    'Agradece cualquier instante hoy en que el lenguaje no te falló — palabra amable, disculpa clara, oración que cupo.\n\n' +
    'Al despertar, lee tu oración antes del feed. Entrena atención, no perfección.\n\n' +
    'Si el día pesado te borra la frase, rescátala al mediodía sin drama; la constancia importa más que el ritual inmaculado.\n\n' +
    'Camina cinco minutos sin auriculares; deja que el cuerpo reciba el aire como corroboración sencilla de gracia común.\n\n' +
    'Antes de apagar la luz, nombra en silencio una persona por quien puedes pedir luz mañana — incluso si esa persona eres tú.\n\n' +
    'Recuerda: la meta no es una semana perfecta sino más verdadera — reparaciones pequeñas, retornos gentiles, Dios encontrándote en palabras ordinarias.',
};

const draft = {
  id: 1,
  number: 1,
  status: 'submitted',
  updatedAt: '2021-08-10T14:48:00.000000Z',
  createdAt: '2021-08-10T14:48:00.000000Z',
};
</script>

<docs lang="md">
# John-style episode with spread + note widgets

Uses the real **translation** layout (`TranslationIndex`) with `language` set to Spanish so `shared.isTranslation` is active. Registers **`spread`** and **`note`** via `widget-fields.ts`. Anonymous panels in the original spec use `name` only for `FieldSpec` typing (`episodeHeader`, `episodeMedia`); paths stay at the bundle root like `title`, `imageUrl`, and `spreads`.
</docs>
