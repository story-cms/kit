import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';

const DEFAULT_OPTIONS: Options = { canBeEmpty: false };
const DEFAULT_MESSAGE =
  'Please provide a valid date range in the format: YYYY-MM-DDTHH:mm:ss.sssZ|YYYY-MM-DDTHH:mm:ss.sssZ';

type Options = {
  canBeEmpty: boolean;
};

/**
 * Implementation
 */
function dateRange(
  value: unknown,
  options: Options = DEFAULT_OPTIONS,
  field: FieldContext,
) {
  if (!hasCorrectShape(value)) {
    field.report(DEFAULT_MESSAGE, 'dateRange', field);
    return;
  }

  const subject = value as string;

  if (options.canBeEmpty && isEmptyValue(subject)) return;

  if (!isValidDateRange(subject, options)) {
    field.report(DEFAULT_MESSAGE, 'dateRange', field);
  }
}

const hasCorrectShape = (value: unknown): boolean => {
  // is the value a string
  if (typeof value !== 'string') return false;
  return true;
};

const isEmptyValue = (value: string): boolean => {
  return value === '' || value.trim() === '';
};

const isValidDateRange = (value: string, options: Options): boolean => {
  // Check if value is empty when canBeEmpty is false
  if (isEmptyValue(value)) {
    return options.canBeEmpty;
  }

  // Split by pipe separator
  const parts = value.split('|');
  if (parts.length !== 2) return false;

  const [startDateStr, endDateStr] = parts;

  // Check that both parts are not empty
  if (!startDateStr || !endDateStr) return false;
  if (startDateStr.trim() === '' || endDateStr.trim() === '') return false;

  // Validate that both are valid ISO date strings
  const startDate = new Date(startDateStr.trim());
  const endDate = new Date(endDateStr.trim());

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;

  // Validate ISO format (basic check - should match ISO 8601 pattern)
  const iso8601Pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  if (
    !iso8601Pattern.test(startDateStr.trim()) ||
    !iso8601Pattern.test(endDateStr.trim())
  ) {
    return false;
  }

  // Check that start date is before end date
  if (startDate >= endDate) return false;

  return true;
};

/**
 * Converting a function to a VineJS rule
 */
export default vine.createRule(dateRange);
