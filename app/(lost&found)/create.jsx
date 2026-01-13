import { useEffect } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'

export default function Create() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/(dashboard)/feed?openCreate=true')
  }, [])

  return <View />
}
