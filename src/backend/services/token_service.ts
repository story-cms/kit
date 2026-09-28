import { inject } from '@adonisjs/core';
import { DateTime } from 'luxon';
import db from '@adonisjs/lucid/services/db';
import type { DailyTokenUsage, LanguageSpecification, TokenPot, TokenTransaction } from '../../types.js';
import Allocation from '../models/allocation.js';
import TokenTopUp from '../models/token_top_up.js';
import TokenUsage from '../models/token_usage.js';
import { CmsService } from './cms_service.js';
import { getTokenBalance } from './token_balance.js';

export { getTokenBalance } from './token_balance.js';

const DAILY_USAGE_DAYS = 7;
const TRANSACTION_WINDOW_DAYS = 30;
const TRANSACTION_LIMIT = 500;
// Luxon's DateTime#weekday is ISO (1 = Monday ... 7 = Sunday); index by `% 7`
// so Sunday (7) wraps to 0.
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@inject()
export class TokenService {
  protected sourceLocale: string;

  constructor(protected cms: CmsService) {
    this.sourceLocale = cms.sourceLocale;
  }

  private localeName(locale: string): string {
    return (
      this.cms.config.languages.find(
        (language: LanguageSpecification) => language.locale === locale,
      )?.language ?? locale
    );
  }

  public async getBalance(locale: string): Promise<number> {
    return getTokenBalance(locale);
  }

  public async poolTotal(): Promise<number> {
    const result = await TokenTopUp.query().sum('tokens as total').first();
    return Number(result?.$extras.total ?? 0);
  }

  // Excludes the source locale: content is never translated *into* it, so
  // its pot would always show zero usage.
  public async pots(): Promise<TokenPot[]> {
    const locales = this.cms.config.languages
      .map((language: LanguageSpecification) => language.locale)
      .filter((locale: string) => locale !== this.sourceLocale);

    return Promise.all(
      locales.map(async (locale: string) => {
        const [allocatedResult, usedResult] = await Promise.all([
          Allocation.query().where('locale', locale).sum('tokens as total').first(),
          TokenUsage.query()
            .where('locale', locale)
            .sum('input_tokens as inputTotal')
            .sum('output_tokens as outputTotal')
            .first(),
        ]);

        const allocated = Number(allocatedResult?.$extras.total ?? 0);
        const inputUsed = Number(usedResult?.$extras.inputTotal ?? 0);
        const outputUsed = Number(usedResult?.$extras.outputTotal ?? 0);

        return {
          locale,
          name: this.localeName(locale),
          allocated,
          used: inputUsed + outputUsed,
        };
      }),
    );
  }

  public async dailyUsage(days: number = DAILY_USAGE_DAYS): Promise<DailyTokenUsage[]> {
    const since = DateTime.now()
      .minus({ days: days - 1 })
      .startOf('day');
    const rows = await TokenUsage.query().where('created_at', '>=', since.toSQL());

    const totalsByDay = new Map<string, number>();
    for (const row of rows) {
      const key = row.createdAt.toISODate();
      if (!key) continue;
      totalsByDay.set(key, (totalsByDay.get(key) ?? 0) + row.inputTokens + row.outputTokens);
    }

    const result: DailyTokenUsage[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = DateTime.now().minus({ days: i });
      const key = date.toISODate();
      result.push({
        day: DAY_LABELS[date.weekday % 7],
        tokens: key ? (totalsByDay.get(key) ?? 0) : 0,
      });
    }

    return result;
  }

  public async recentTransactions(): Promise<TokenTransaction[]> {
    const since = DateTime.now().minus({ days: TRANSACTION_WINDOW_DAYS });
    const rows = await TokenUsage.query()
      .where('created_at', '>=', since.toSQL())
      .orderBy('created_at', 'desc')
      .limit(TRANSACTION_LIMIT);

    return rows.map((row) => ({
      date: row.createdAt.toFormat('dd LLL yyyy'),
      action: row.action ?? 'Translated content',
      sourceLanguage: this.localeName(row.sourceLocale ?? this.sourceLocale),
      targetLanguage: this.localeName(row.locale),
      blocks: row.blockCount ?? 0,
      tokensUsed: row.inputTokens + row.outputTokens,
    }));
  }

  // Re-derives every number from the DB rather than trusting a client-sent
  // value, and clamps exactly like the frontend does: can't allocate more
  // than what's unallocated, can't deallocate a locale below what it has
  // already used. Writes a single signed Allocation row — unallocated falls
  // out of poolTotal minus the sum of every Allocation row, so there's no
  // paired transfer to keep in sync.
  public async allocate(locale: string, delta: number, userId: number): Promise<void> {
    if (delta === 0) return;

    await db.transaction(async (trx) => {
      const [poolTotalResult, allocatedTotalResult, currentAllocatedResult, usedResult] =
        await Promise.all([
          TokenTopUp.query({ client: trx }).sum('tokens as total').first(),
          Allocation.query({ client: trx }).sum('tokens as total').first(),
          Allocation.query({ client: trx }).where('locale', locale).sum('tokens as total').first(),
          TokenUsage.query({ client: trx })
            .where('locale', locale)
            .sum('input_tokens as inputTotal')
            .sum('output_tokens as outputTotal')
            .first(),
        ]);

      const poolTotal = Number(poolTotalResult?.$extras.total ?? 0);
      const allocatedTotal = Number(allocatedTotalResult?.$extras.total ?? 0);
      const unallocated = poolTotal - allocatedTotal;
      const currentAllocated = Number(currentAllocatedResult?.$extras.total ?? 0);
      const used =
        Number(usedResult?.$extras.inputTotal ?? 0) +
        Number(usedResult?.$extras.outputTotal ?? 0);

      const applied =
        delta > 0
          ? Math.min(delta, unallocated)
          : Math.max(used, currentAllocated + delta) - currentAllocated;

      if (applied === 0) return;

      await Allocation.create({ locale, tokens: applied, userId }, { client: trx });
    });
  }
}
