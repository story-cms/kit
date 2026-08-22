import type { ChapterBlock, ChapterContentBlock, ChapterContentItem } from '../types.js';

export const createBlockId = (): string => crypto.randomUUID();

export const blockKind = (block: ChapterBlock): ChapterBlock['kind'] =>
  block.kind ?? 'content';

const cloneContentItemStructure = (item: ChapterContentItem): ChapterContentItem => {
  const id = createBlockId();

  if (item.kind === 'image') {
    return { id, kind: 'image', imageUrl: '' };
  }

  if (item.kind === 'video') {
    return { id, kind: 'video', video: { url: null } };
  }

  return { id, kind: 'scripture', scripture: { reference: '', verse: '' } };
};

const cloneBlockStructure = (block: ChapterBlock): ChapterBlock => {
  const visibility = { ...block.visibility };
  const kind = blockKind(block);

  if (kind === 'title') {
    return {
      id: createBlockId(),
      kind: 'title',
      blockName: '',
      title: '',
      subtitle: '',
      coverImage: '',
      visibility,
    };
  }

  if (kind === 'scripture') {
    return {
      id: createBlockId(),
      kind: 'scripture',
      blockName: '',
      displayName: '',
      scripture: { reference: '', verse: '' },
      visibility,
      leadersNotes: '',
      showLeadersNotes: false,
    };
  }

  const contentBlock = block as ChapterContentBlock;
  return {
    id: createBlockId(),
    kind: 'content',
    blockName: '',
    displayName: '',
    blockRole: contentBlock.blockRole,
    style: contentBlock.style,
    content: '',
    items: (contentBlock.items ?? []).map(cloneContentItemStructure),
    visibility,
    leadersNotes: '',
    showLeadersNotes: false,
  };
};

export const cloneBlocksStructure = (blocks: ChapterBlock[]): ChapterBlock[] =>
  blocks.map(cloneBlockStructure);
