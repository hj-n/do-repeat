import type { TFunction } from 'i18next';

export const PRESETS = [
  'exercise',
  'reading',
  'study',
  'water',
  'walk',
  'meditate',
  'journal',
] as const;
export type PresetId = (typeof PRESETS)[number];

export function isPresetId(value: unknown): value is PresetId {
  return typeof value === 'string' && (PRESETS as readonly string[]).includes(value);
}

export type VerifyMethod = 'location' | 'photo';

/** Default check-in radius around a saved place, in meters */
export const DEFAULT_RADIUS = 150;

/**
 * Display name of a repeat. Presets are stored as an id and translated,
 * so switching the language also renames them.
 */
export function habitTitle(
  habit: { preset?: PresetId; customTitle?: string },
  t: TFunction,
): string {
  if (habit.preset) return t(`presets.${habit.preset}`);
  return habit.customTitle ?? '';
}
