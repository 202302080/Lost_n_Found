import { createContext, useState } from 'react'
import { Alert } from 'react-native'
import { API_URL } from '../lib/api'

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  // 🔐 LOGIN
  async function login(email, password) {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        Alert.alert('Login Failed', data.message)
        return false
      }

      setUser(data.user)
      setToken(data.token)
      return true
    } catch (error) {
      Alert.alert('Error', 'Server not reachable')
      return false
    }
  }

  // 📝 REGISTER
  async function register(email, password) {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        Alert.alert('Registration Failed', data.message)
        return false
      }

      Alert.alert('Success', 'Account created')
      return true
    } catch (error) {
      Alert.alert('Error', 'Server not reachable')
      return false
    }
  }

  // 🚪 LOGOUT
  async function logout() {
    setUser(null)
    setToken(null)
  }

  return (
    <UserContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </UserContext.Provider>
  )
}
