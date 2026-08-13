import type {
  ChapterBlock,
  ChapterContentBlock,
  ChapterContentItem,
  ChapterScriptureBlock,
  ChapterTitleBlock,
  ResourceType,
  Scripture,
} from '../../../../types';

export const DEFAULT_BLOCK_ROLE = 'summary';
export const DEFAULT_BLOCK_STYLE = 'primary';

const defaultVisibility = {
  presenter: false,
  personal: false,
  inNavigation: false,
  hidden: false,
};

type LegacyChapterContentBlock = ChapterContentBlock & {
  blockType?: ResourceType;
  url?: string;
  video?: { url: string | null };
};

export function createBlockId(): string {
  return crypto.randomUUID();
}

export function createEmptyContentBlock(): ChapterContentBlock {
  return {
    id: createBlockId(),
    kind: 'content',
    blockName: '',
    displayName: '',
    blockRole: DEFAULT_BLOCK_ROLE,
    style: DEFAULT_BLOCK_STYLE,
    content: '',
    items: [],
    visibility: { ...defaultVisibility },
    leadersNotes: '',
    showLeadersNotes: false,
  };
}

export function createContentItem(kind: ChapterContentItem['kind']): ChapterContentItem {
  const id = createBlockId();

  if (kind === 'image') {
    return { id, kind, imageUrl: '' };
  }

  if (kind === 'video') {
    return { id, kind, video: { url: null } };
  }

  return { id, kind, scripture: { reference: '', verse: '' } };
}

export function normalizeContentBlock(block: ChapterContentBlock): ChapterContentBlock {
  if (Array.isArray(block.items)) {
    return block;
  }

  const legacy = block as LegacyChapterContentBlock;
  const items: ChapterContentItem[] = [];
  let content = block.content ?? '';

  if (legacy.blockType === 'video') {
    items.push(createContentItem('video'));
    if (items[0]?.video) {
      items[0].video = legacy.video ?? { url: null };
    }
  } else if (legacy.blockType === 'url' && legacy.url) {
    content = legacy.url;
  }

  const normalized: ChapterContentBlock = {
    id: block.id,
    kind: 'content',
    blockName: block.blockName,
    displayName: block.displayName,
    blockRole: block.blockRole,
    style: block.style,
    content,
    items,
    visibility: block.visibility,
    leadersNotes: block.leadersNotes,
    showLeadersNotes: block.showLeadersNotes,
  };

  return normalized;
}

export function normalizeBlocks(blocks: ChapterBlock[]): ChapterBlock[] {
  return blocks.map((block) =>
    block.kind === 'content' ? normalizeContentBlock(block) : block,
  );
}

export function createEmptyTitleBlock(): ChapterTitleBlock {
  return {
    id: createBlockId(),
    kind: 'title',
    blockName: '',
    title: '',
    subtitle: '',
    coverImage: '',
    visibility: { ...defaultVisibility },
  };
}

export function createEmptyScriptureBlock(): ChapterScriptureBlock {
  return {
    id: createBlockId(),
    kind: 'scripture',
    blockName: '',
    displayName: '',
    scripture: { reference: '', verse: '' } satisfies Scripture,
    visibility: { ...defaultVisibility },
    leadersNotes: '',
    showLeadersNotes: false,
  };
}

export function blockKind(block: ChapterBlock): ChapterBlock['kind'] {
  return block.kind ?? 'content';
}
