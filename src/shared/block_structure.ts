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

  if (item.kind === 'text') {
    return { id, kind: 'text', content: '' };
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

  const contentBlock = block as ChapterContentBlock;
  return {
    id: createBlockId(),
    kind: 'content',
    blockName: '',
    displayName: '',
    blockRole: contentBlock.blockRole,
    style: contentBlock.style,
    items: (contentBlock.items ?? []).map(cloneContentItemStructure),
    visibility,
    leadersNotes: '',
    showLeadersNotes: contentBlock.showLeadersNotes,
  };
};

export const cloneBlocksStructure = (blocks: ChapterBlock[]): ChapterBlock[] =>
  blocks.map(cloneBlockStructure);
