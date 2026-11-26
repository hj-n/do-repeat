import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

/**
 * Saves app data on the device. Errors are swallowed so the app still works
 * where storage is blocked (for example a private browser window).
 */
const safeStorage: StateStorage = {
  getItem: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};

export const appStorage = createJSONStorage(() => safeStorage);
