import type { TokenPot, TokenPotField } from '../../../types';

const LOW_REMAINING_RATIO = 0.15;

export const potRemaining = (pot: TokenPot): number => pot.allocated - pot.used;

export const potPercentUsed = (pot: TokenPot): number =>
  pot.allocated === 0 ? 0 : Math.round((pot.used / pot.allocated) * 100);

export const isLowPot = (pot: TokenPot): boolean =>
  pot.allocated > 0 && potRemaining(pot) / pot.allocated < LOW_REMAINING_RATIO;

export const potFieldValue = (pot: TokenPot, field: TokenPotField): number =>
  field === 'remaining' ? potRemaining(pot) : pot[field];
