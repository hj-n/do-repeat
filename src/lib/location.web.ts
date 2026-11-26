import { create } from 'zustand';

import { offsetNorth, type Coordinates } from './geo';
import type { LocationPurpose, LocationResult } from './location-types';

/**
 * Web preview: browsers inside the preview page can't use real GPS,
 * so we pretend. Saved spots go to a sample point, and check-ins land
 * inside or outside it depending on the "Preview location" setting.
 */
export const isSimulatedLocation = true;

const SAMPLE_SPOT: Coordinates = { latitude: 37.5665, longitude: 126.978 };

export type PreviewPosition = 'inside' | 'outside';

export const usePreviewLocation = create<{
  position: PreviewPosition;
  setPosition: (position: PreviewPosition) => void;
}>((set) => ({
  position: 'inside',
  setPosition: (position) => set({ position }),
}));

export async function getCurrentPosition(purpose: LocationPurpose): Promise<LocationResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const meters =
    purpose === 'register' ? 0 : usePreviewLocation.getState().position === 'inside' ? 40 : 420;
  return { ok: true, coords: offsetNorth(SAMPLE_SPOT, meters), accuracy: 12, mocked: false };
}
