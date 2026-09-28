import Allocation from '../models/allocation.js';
import TokenUsage from '../models/token_usage.js';

// A locale's balance is tokens allocated to it minus tokens actually used.
// Kept in its own module, free of any @adonisjs/lucid/services/db import
// (unlike token_service.ts, which needs it for db.transaction in allocate()),
// so ChapterTranslationService — which lives in the kit library and cannot
// import a consumer app's #services/cms — can share this exact calculation
// without pulling in a module that requires a booted app container just to
// import (this repo's unit tests run without one).
export async function getTokenBalance(locale: string): Promise<number> {
  const allocatedResult = await Allocation.query()
    .where('locale', locale)
    .sum('tokens as total')
    .first();
  const usageResult = await TokenUsage.query()
    .where('locale', locale)
    .sum('input_tokens as inputTotal')
    .sum('output_tokens as outputTotal')
    .first();

  const allocated = Number(allocatedResult?.$extras.total ?? 0);
  const inputUsed = Number(usageResult?.$extras.inputTotal ?? 0);
  const outputUsed = Number(usageResult?.$extras.outputTotal ?? 0);

  return allocated - inputUsed - outputUsed;
}
