export type Coordinates = { latitude: number; longitude: number };

const EARTH_RADIUS_M = 6_371_000;

/** Straight-line distance between two points, in meters (haversine). */
export function distanceInMeters(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/** A point `meters` north of `from`. */
export function offsetNorth(from: Coordinates, meters: number): Coordinates {
  return { latitude: from.latitude + meters / 111_320, longitude: from.longitude };
}

/**
 * Inside the spot? GPS is fuzzy indoors, so the reported accuracy
 * (capped at 100m) is added to the radius as slack.
 */
export function isWithinPlace(distance: number, radius: number, accuracy: number | null): boolean {
  return distance <= radius + Math.min(accuracy ?? 0, 100);
}

/** 320 → "320m", 1240 → "1.2km" */
export function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(1)}km`;
}
