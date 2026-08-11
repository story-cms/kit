import type {
  StoryBlock,
  StoryContentBlock,
  StoryScriptureBlock,
  StoryTitleBlock,
} from '../../../types';

export const DEFAULT_BLOCK_ROLE = 'summary';
export const DEFAULT_BLOCK_STYLE = 'default';

const defaultVisibility = {
  presenter: true,
  personal: true,
  hidden: false,
};

export function createBlockId(): string {
  return crypto.randomUUID();
}

export function createEmptyBlock(): StoryContentBlock {
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

export function createEmptyTitleBlock(): StoryTitleBlock {
  return {
    id: createBlockId(),
    kind: 'title',
    blockName: '',
    title: '',
    style: DEFAULT_BLOCK_STYLE,
    visibility: { ...defaultVisibility },
  };
}

export function createEmptyScriptureBlock(): StoryScriptureBlock {
  return {
    id: createBlockId(),
    kind: 'scripture',
    blockName: '',
    scripture: { reference: '', verse: '' },
    visibility: { ...defaultVisibility },
    leadersNotes: '',
    showLeadersNotes: true,
  };
}

export function blockKind(block: StoryBlock): StoryBlock['kind'] {
  return block.kind ?? 'content';
}
