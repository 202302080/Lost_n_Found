import { Platform } from 'react-native'

// Default local server host selection:
// - Android emulator (API 29 with Android Studio): use 10.0.2.2
// - iOS simulator or Expo web: use localhost
// For a physical device, replace LOCAL_HOST with your machine IP (e.g. 192.168.x.x)
const LOCAL_HOST = Platform.OS === 'android' ? '192.168.18.6' : 'localhost'

export const API_URL = `http://${LOCAL_HOST}:5000/api`

export const fixLocalhostUrl = (url) => {
  if (!url) return url;
  if (Platform.OS === 'android' && url.includes('localhost')) {
    return url.replace('localhost', '10.0.2.2'); // For emulator
  }
  if (Platform.OS === 'android' && url.includes('127.0.0.1')) {
     return url.replace('127.0.0.1', '192.168.18.6'); // For your physical phone
  }
  return url;
};