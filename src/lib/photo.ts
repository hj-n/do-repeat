import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export type PhotoResult =
  | { ok: true; uri: string }
  | { ok: false; reason: 'canceled' | 'denied' | 'error' };

/** The web preview has no camera, so it opens a file picker instead. */
export const usesFilePicker = Platform.OS === 'web';

/**
 * Take a check-in photo. On phones this opens the camera only (not the gallery),
 * so old photos can't be reused.
 */
export async function takeCheckInPhoto(): Promise<PhotoResult> {
  try {
    if (usesFilePicker) {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7 });
      return result.canceled ? { ok: false, reason: 'canceled' } : { ok: true, uri: result.assets[0].uri };
    }
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return { ok: false, reason: 'denied' };
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: 'images', quality: 0.7 });
    return result.canceled ? { ok: false, reason: 'canceled' } : { ok: true, uri: result.assets[0].uri };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
