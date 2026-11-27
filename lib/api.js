import { Platform } from 'react-native'
import Constants from 'expo-constants'

// Server host selection:
// - Expo Go / dev build on a physical device: use the same IP the Metro bundler
//   is served from (the PC running `expo start`), so it works on any Wi-Fi network.
// - Expo web: localhost
// - Fallback (no hostUri): Android emulator alias 10.0.2.2, otherwise localhost
const getLocalHost = () => {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost
  const host = hostUri?.split(':')[0]
  if (host && Platform.OS !== 'web') return host
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
}

const LOCAL_HOST = getLocalHost()

export const SERVER_URL = `http://${LOCAL_HOST}:5000`
export const API_URL = `${SERVER_URL}/api`

export const DEFAULT_AVATAR = 'https://randomuser.me/api/portraits/men/1.jpg'

// Uploaded images are saved with the server address used at upload time
// (e.g. localhost or an old Wi-Fi IP). Point them at the current server instead.
export const fixLocalhostUrl = (url) => {
  if (!url) return url
  // server-relative links such as /api/posts/<id>/image
  if (url.startsWith('/')) return `${SERVER_URL}${url}`
  const match = /^https?:\/\/[^/]+(\/uploads\/.+)$/.exec(url)
  return match ? `${SERVER_URL}${match[1]}` : url
}
