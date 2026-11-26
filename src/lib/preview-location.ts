/**
 * Native builds use real GPS, so there is no preview position to control.
 * (The web version of this file lives in preview-location.web.ts.)
 */
export type PreviewPosition = 'inside' | 'outside';

export function usePreviewPosition(): {
  position: PreviewPosition;
  setPosition: (position: PreviewPosition) => void;
} | null {
  return null;
}
