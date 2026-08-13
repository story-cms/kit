import type {
  ChapterBlock,
  ChapterContentBlock,
  ChapterScriptureBlock,
  ChapterTitleBlock,
} from '../../../../types';

export const DEFAULT_BLOCK_ROLE = 'summary';
export const DEFAULT_BLOCK_STYLE = 'default';

const defaultVisibility = {
  presenter: true,
  personal: true,
  inNavigation: true,
  hidden: false,
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
    blockType: 'text',
    content: '',
    url: '',
    video: { url: null },
    visibility: { ...defaultVisibility },
    leadersNotes: '',
    showLeadersNotes: true,
  };
}

export function createEmptyTitleBlock(): ChapterTitleBlock {
  return {
    id: createBlockId(),
    kind: 'title',
    blockName: '',
    title: '',
    subtitle: '',
    coverImage: '',
    style: DEFAULT_BLOCK_STYLE,
    visibility: { ...defaultVisibility },
  };
}

export function createEmptyScriptureBlock(): ChapterScriptureBlock {
  return {
    id: createBlockId(),
    kind: 'scripture',
    blockName: '',
    displayName: '',
    scripture: { reference: '', verse: '' },
    visibility: { ...defaultVisibility },
    leadersNotes: '',
    showLeadersNotes: true,
  };
}

export function blockKind(block: ChapterBlock): ChapterBlock['kind'] {
  return block.kind ?? 'content';
}
