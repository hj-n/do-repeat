import type { Coordinates } from './geo';

export type LocationResult =
  | { ok: true; coords: Coordinates; accuracy: number | null; mocked: boolean }
  | { ok: false; reason: 'denied' | 'unavailable' };

/** register: saving a spot / verify: checking in */
export type LocationPurpose = 'register' | 'verify';
