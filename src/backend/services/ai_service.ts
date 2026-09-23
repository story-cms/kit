import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { encode } from 'gpt-tokenizer';

export class AiService {
  private client: OpenAI | null = null;

  private getClient() {
    if (!this.client) {
      this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return this.client;
  }
  private MAX_INPUT_TOKENS = 4096;
  private MAX_OUTPUT_TOKENS = 4096;
  private TOKEN_BUFFER = 500;
  private MODEL = 'gpt-4o-2024-08-06';
  private SYSTEM_PROMPT =
    'You are a professional translator. Translate texts naturally and concisely for a mobile app. Preserve all placeholders exactly as they appear (e.g., {userName}).';

  public async translate(input: TranslationInput): Promise<{
    output: TranslationOutput;
    usage: { inputTokens: number; outputTokens: number };
  }> {
    const parsed = TranslationInputSchema.parse(input);
    const output: TranslationOutput = {};
    const usage = { inputTokens: 0, outputTokens: 0 };
    const batches = this.getBatchedSources(parsed);
    const sourcePlaceholders = new Map(
      parsed.translationSources.map((s) => [s.id, s.placeholders]),
    );

    for (const batch of batches) {
      const prompt = this.createPrompt(parsed.outputLocales, batch);

      const completion = await this.getClient().chat.completions.parse({
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        model: this.MODEL,
        response_format: zodResponseFormat(TranslationResponseSchema, 'translations'),
      });

      usage.inputTokens += completion.usage?.prompt_tokens ?? 0;
      usage.outputTokens += completion.usage?.completion_tokens ?? 0;

      const result = completion.choices[0].message.parsed;
      if (!result) throw new Error('Translation failed');

      // Validate and merge results
      for (const translation of result.translations) {
        for (const item of translation.items) {
          const placeholders = sourcePlaceholders.get(item.id);
          if (placeholders) {
            this.validatePlaceholders(item.text, placeholders);
          }
        }
        output[translation.locale] = [
          ...(output[translation.locale] || []),
          ...translation.items,
        ];
      }
    }

    return { output: TranslationOutputSchema.parse(output), usage };
  }

  // Dry-run estimate: tokenizes locally against the same batching `translate()`
  // would use, without ever calling OpenAI.
  public estimateTokens(input: TranslationInput): {
    inputTokens: number;
    outputTokens: number;
  } {
    const parsed = TranslationInputSchema.parse(input);
    const batches = this.getBatchedSources(parsed);
    const inputTokens = batches.reduce(
      (total, batch) =>
        total +
        encode(this.SYSTEM_PROMPT).length +
        encode(this.createPrompt(parsed.outputLocales, batch)).length,
      0,
    );
    const outputTokens = this.estimateOutputTokens(
      parsed.outputLocales,
      parsed.translationSources,
    );

    return { inputTokens, outputTokens };
  }

  private getBatchedSources(input: TranslationInput): TranslationSource[][] {
    const batches: TranslationSource[][] = [];
    let currentBatch: TranslationSource[] = [];
    let currentTokenCount = 0;

    const systemTokens = encode(this.SYSTEM_PROMPT).length;
    const localesTokens = encode(input.outputLocales.join(', ')).length;
    const baseTokenCount = systemTokens + localesTokens + this.TOKEN_BUFFER;

    for (const source of input.translationSources) {
      this.validatePlaceholders(source.text, source.placeholders);
      const sourceText = this.createPrompt(input.outputLocales, [source]);
      const sourceTokens = encode(sourceText).length;
      const outputTokens = this.estimateOutputTokens(input.outputLocales, [source]);

      if (
        currentTokenCount + sourceTokens + baseTokenCount > this.MAX_INPUT_TOKENS ||
        outputTokens > this.MAX_OUTPUT_TOKENS
      ) {
        if (currentBatch.length > 0) {
          batches.push(currentBatch);
          currentBatch = [];
          currentTokenCount = 0;
        }
      }

      currentBatch.push(source);
      currentTokenCount += sourceTokens;
    }

    if (currentBatch.length > 0) batches.push(currentBatch);
    return batches;
  }

  private createPrompt(locales: string[], sources: TranslationSource[]): string {
    if (!locales.length || !sources.length) {
      throw new Error('Locales and sources cannot be empty.');
    }

    const placeholderNote = 'Keep placeholders like {placeholderName} unchanged.';
    const formattedSources = sources.map(this.formatSource).join('\n\n');

    return `Translate to ${locales.join(', ')}:\n${placeholderNote}\n\n${formattedSources}`;
  }

  private formatSource(source: TranslationSource): string {
    const { id, text, description, placeholders } = source;

    return [
      `ID: ${id}`,
      `Text: "${text}"`,
      description ? `Description: ${description}` : '',
      placeholders?.length ? `Placeholders: ${placeholders.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  private validatePlaceholders(text: string, placeholders?: string[]): void {
    if (!placeholders) return;

    for (const placeholder of placeholders) {
      if (!text.includes(`{${placeholder}}`)) {
        throw new Error(`Missing placeholder {${placeholder}} in: "${text}"`);
      }
    }

    const usedPlaceholders = text.match(/\{([^}]+)\}/g)?.map((p) => p.slice(1, -1)) || [];
    for (const used of usedPlaceholders) {
      if (!placeholders.includes(used)) {
        throw new Error(`Undefined placeholder {${used}} in: "${text}"`);
      }
    }
  }

  public estimateOutputTokens(locales: string[], sources: TranslationSource[]): number {
    const expansionFactor = 1.5;
    const baseTokens = 20;
    let total = 0;

    for (const source of sources) {
      const sourceTokens = encode(source.text).length;
      total += (sourceTokens * expansionFactor + baseTokens) * locales.length;
    }

    return Math.ceil(total);
  }
}

// Schemas
const TranslationSourceSchema = z.object({
  id: z.string(),
  text: z.string(),
  description: z.string().optional(),
  placeholders: z.array(z.string()).optional(),
});

const TranslationInputSchema = z.object({
  outputLocales: z.array(z.string()),
  translationSources: z.array(TranslationSourceSchema),
});

const TranslationOutputSchema = z.record(
  z.string(),
  z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
);

const TranslationResponseSchema = z.object({
  translations: z.array(
    z.object({
      locale: z.string(),
      items: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
        }),
      ),
    }),
  ),
});

// Types
export type TranslationOutput = z.infer<typeof TranslationOutputSchema>;
export type TranslationInput = z.infer<typeof TranslationInputSchema>;
export type TranslationSource = z.infer<typeof TranslationSourceSchema>;
