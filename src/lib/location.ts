import * as Location from 'expo-location';

import type { LocationPurpose, LocationResult } from './location-types';

/** On a phone we use real GPS. (The web preview uses location.web.ts instead.) */
export const isSimulatedLocation = false;

const TIMEOUT_MS = 15_000;
const LAST_KNOWN_MAX_AGE_MS = 2 * 60_000;

export async function getCurrentPosition(_purpose: LocationPurpose): Promise<LocationResult> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) return { ok: false, reason: 'denied' };

  try {
    const position = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS)),
    ]);
    // Indoors a fresh fix can take long; fall back to a recent one.
    const fix =
      position ?? (await Location.getLastKnownPositionAsync({ maxAge: LAST_KNOWN_MAX_AGE_MS }));
    if (!fix) return { ok: false, reason: 'unavailable' };
    return {
      ok: true,
      coords: { latitude: fix.coords.latitude, longitude: fix.coords.longitude },
      accuracy: fix.coords.accuracy ?? null,
      mocked: fix.mocked === true,
    };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}
