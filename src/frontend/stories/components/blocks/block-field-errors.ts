type ValidationErrors = Record<string, string | string[]>;

function normalizedMessages(messages: string | string[] | undefined): string[] {
  if (!messages) return [];
  return Array.isArray(messages) ? messages : [messages];
}

function blockPrefix(blockIndex: number): string {
  return `bundle.blocks.${blockIndex}`;
}

export function blockFieldErrorMessages(
  errors: ValidationErrors,
  blockIndex: number,
  field: string,
): string[] {
  return normalizedMessages(errors[`${blockPrefix(blockIndex)}.${field}`]);
}

export function blockItemFieldErrorMessages(
  errors: ValidationErrors,
  blockIndex: number,
  itemIndex: number,
  field: string,
): string[] {
  return normalizedMessages(
    errors[`${blockPrefix(blockIndex)}.items.${itemIndex}.${field}`],
  );
}

export function blockHasError(errors: ValidationErrors, blockIndex: number): boolean {
  const prefix = blockPrefix(blockIndex);
  return Object.keys(errors).some((key) => key === prefix || key.startsWith(`${prefix}.`));
}

export function blockLevelErrorMessages(
  errors: ValidationErrors,
  blockIndex: number,
): string[] {
  return normalizedMessages(errors[blockPrefix(blockIndex)]);
}

export function blocksArrayErrorMessages(errors: ValidationErrors): string[] {
  return [
    ...normalizedMessages(errors['bundle.blocks']),
    ...normalizedMessages(errors['bundle.blocks.minLength']),
  ];
}
