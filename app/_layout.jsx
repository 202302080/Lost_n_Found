import { Stack } from 'expo-router'
import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { colors }  from "../constants/colors"
import { StatusBar } from 'expo-status-bar'
import { UserProvider } from '../contexts/UserContexts'

const Rootlayout = () => {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light

  return (
    <UserProvider>
      <StatusBar value="auto"/>
      <Stack screenOptions={{
          headerStyle : { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
      }}>
          <Stack.Screen name="index" options={{ title: 'Home'}} />
          <Stack.Screen name="(auth)" options={{ headerShown: false}} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false}} />
          
      </Stack>
    </UserProvider>
  )
}

export default Rootlayout

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
}
})
