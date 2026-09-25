import type {
  ChapterBlock,
  ChapterContentBlock,
  ChapterContentItem,
  StandardChapterBundle,
} from '../../types.js';
import type { TranslationSource } from './ai_service.js';
import { getAiService } from './ai_service_factory.js';
import { getTokenBalance } from './token_balance.js';
import TokenUsage from '../models/token_usage.js';
import TranslationJob from '../models/translation_job.js';

export { setMockAiService, resetAiService } from './ai_service_factory.js';

interface TranslatedChapterContent {
  title: string;
  description: string;
  blocks: ChapterBlock[];
}

interface TranslationContext {
  storyId: number;
  draftId: number;
  translationJobId: number;
  sourceLocale: string;
}

const TITLE_ID = 'title';
const DESCRIPTION_ID = 'description';
const blockTitleId = (blockId: string) => `block:${blockId}:title`;
const blockSubtitleId = (blockId: string) => `block:${blockId}:subtitle`;
const blockLeadersNotesId = (blockId: string) => `block:${blockId}:leadersNotes`;
const blockItemId = (blockId: string, itemId: string) =>
  `block:${blockId}:item:${itemId}`;

// Persisted content blocks aren't guaranteed to have a populated `items`
// array — the save-time validator allows it to be omitted — even though the
// TypeScript type declares it as required.
const contentBlockItems = (block: ChapterContentBlock): ChapterContentItem[] =>
  Array.isArray(block.items) ? block.items : [];

export default class ChapterTranslationService {
  private buildTranslationSources(source: StandardChapterBundle): TranslationSource[] {
    const translationSources: TranslationSource[] = [];

    if (source.title?.trim()) {
      translationSources.push({ id: TITLE_ID, text: source.title });
    }
    if (source.description?.trim()) {
      translationSources.push({ id: DESCRIPTION_ID, text: source.description });
    }

    for (const block of source.blocks) {
      if (block.kind === 'title') {
        if (block.title?.trim()) {
          translationSources.push({ id: blockTitleId(block.id), text: block.title });
        }
        if (block.subtitle?.trim()) {
          translationSources.push({
            id: blockSubtitleId(block.id),
            text: block.subtitle,
          });
        }
      } else {
        if (block.leadersNotes?.trim()) {
          translationSources.push({
            id: blockLeadersNotesId(block.id),
            text: block.leadersNotes,
          });
        }
        for (const item of contentBlockItems(block)) {
          if (item.kind === 'text' && item.content?.trim()) {
            translationSources.push({
              id: blockItemId(block.id, item.id),
              text: item.content,
            });
          }
        }
      }
    }

    return translationSources;
  }

  // A locale's balance is global across every story translated into it: its
  // allocated tokens minus everything actually used (see getTokenBalance,
  // shared with TokenService so both compute this identically), minus the
  // estimated cost of every other job still pending/processing for that
  // locale. That last part is what stops two concurrent translations from
  // both seeing a "sufficient" balance and jointly overspending it before
  // either finishes.
  private async getBalance(locale: string): Promise<number> {
    const balance = await getTokenBalance(locale);
    const reservedResult = await TranslationJob.query()
      .where('locale', locale)
      .whereIn('status', ['pending', 'processing'])
      .sum('estimated_tokens as total')
      .first();

    const reserved = Number(reservedResult?.$extras.total ?? 0);

    return balance - reserved;
  }

  public async estimate(
    source: StandardChapterBundle,
    targetLocale: string,
  ): Promise<{ inputTokens: number; outputTokens: number; balance: number }> {
    const translationSources = this.buildTranslationSources(source);
    const { inputTokens, outputTokens } = getAiService().estimateTokens({
      outputLocales: [targetLocale],
      translationSources,
    });
    const balance = await this.getBalance(targetLocale);

    return { inputTokens, outputTokens, balance };
  }

  public async translate(
    source: StandardChapterBundle,
    targetLocale: string,
    context: TranslationContext,
  ): Promise<TranslatedChapterContent> {
    const translationSources = this.buildTranslationSources(source);

    const { output, usage } = await getAiService().translate({
      outputLocales: [targetLocale],
      translationSources,
    });

    try {
      await TokenUsage.create({
        storyId: context.storyId,
        draftId: context.draftId,
        locale: targetLocale,
        translationJobId: context.translationJobId,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        action: `Translated "${source.title?.trim() || 'Untitled chapter'}"`,
        sourceLocale: context.sourceLocale,
        blockCount: source.blocks.length,
      });
    } catch (error) {
      console.error(
        'ChapterTranslationService.translate: failed to log token usage',
        error,
      );
    }

    const translations = new Map(
      (output[targetLocale] ?? []).map((item) => [item.id, item.text]),
    );

    const translated = (id: string, fallback: string) => translations.get(id) ?? fallback;

    const blocks: ChapterBlock[] = source.blocks.map((block) => {
      if (block.kind === 'title') {
        return {
          ...block,
          title: translated(blockTitleId(block.id), block.title ?? ''),
          subtitle: translated(blockSubtitleId(block.id), block.subtitle ?? ''),
        };
      }

      return {
        ...block,
        leadersNotes: translated(blockLeadersNotesId(block.id), block.leadersNotes ?? ''),
        items: contentBlockItems(block).map((item) =>
          item.kind === 'text' && item.content
            ? {
                ...item,
                content: translated(blockItemId(block.id, item.id), item.content),
              }
            : item,
        ),
      };
    });

    return {
      title: translated(TITLE_ID, source.title ?? ''),
      description: translated(DESCRIPTION_ID, source.description ?? ''),
      blocks,
    };
  }
}
