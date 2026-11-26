import { usePreviewLocation, type PreviewPosition } from './location.web';

export type { PreviewPosition };

/** Web preview: read and change where the simulated check-in happens. */
export function usePreviewPosition() {
  const position = usePreviewLocation((s) => s.position);
  const setPosition = usePreviewLocation((s) => s.setPosition);
  return { position, setPosition };
}
