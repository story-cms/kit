import type {
  ChapterBlock,
  ChapterContentBlock,
  ChapterContentItem,
  ChapterTitleBlock,
  ResourceType,
} from '../../../../types';
import { blockKind, createBlockId } from '../../../../shared/block_structure';

export { blockKind, createBlockId };

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

export function createEmptyContentBlock(
  blockRole: string = DEFAULT_BLOCK_ROLE,
): ChapterContentBlock {
  return {
    id: createBlockId(),
    kind: 'content',
    blockName: '',
    displayName: '',
    blockRole,
    style: DEFAULT_BLOCK_STYLE,
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

  if (kind === 'text') {
    return { id, kind, content: '' };
  }

  return { id, kind, scripture: { reference: '', verse: '' } };
}

export function normalizedContentBlock(block: ChapterContentBlock): ChapterContentBlock {
  if (Array.isArray(block.items)) {
    return block;
  }

  const legacy = block as LegacyChapterContentBlock;
  const items: ChapterContentItem[] = [];

  if (legacy.blockType === 'video') {
    items.push(createContentItem('video'));
    if (items[0]?.video) {
      items[0].video = legacy.video ?? { url: null };
    }
  }

  const normalized: ChapterContentBlock = {
    id: block.id,
    kind: 'content',
    blockName: block.blockName,
    displayName: block.displayName,
    blockRole: block.blockRole,
    style: block.style,
    items,
    visibility: block.visibility,
    leadersNotes: block.leadersNotes,
    showLeadersNotes: block.showLeadersNotes,
  };

  return normalized;
}

export function normalizedBlocks(blocks: ChapterBlock[]): ChapterBlock[] {
  return blocks.map((block) =>
    block.kind === 'content' ? normalizedContentBlock(block) : block,
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

