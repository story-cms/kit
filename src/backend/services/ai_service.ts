import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { encode } from 'node:punycode';

export default class AiService {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  private MAX_INPUT_TOKENS = 4096;
  private MAX_OUTPUT_TOKENS = 4096;
  private TOKEN_BUFFER = 500;
  private MODEL = 'gpt-4o-2024-08-06';
  private SYSTEM_PROMPT =
    'You are a professional translator. Translate texts naturally and concisely for a mobile app. Preserve all placeholders exactly as they appear (e.g., {userName}).';

  public async translate(input: TranslationInput): Promise<TranslationOutput> {
    const output: TranslationOutput = {};
    const batches = this.getBatchedSources(input);
    const sourcePlaceholders = new Map(
      input.translationSources.map((s) => [s.id, s.placeholders]),
    );

    for (const batch of batches) {
      const prompt = this.createPrompt(input.outputLocales, batch);

      const completion = await this.client.chat.completions.parse({
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        model: this.MODEL,
        response_format: zodResponseFormat(TranslationResponseSchema, 'translations'),
      });

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

    return TranslationOutputSchema.parse(output);
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

  private estimateOutputTokens(locales: string[], sources: TranslationSource[]): number {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
