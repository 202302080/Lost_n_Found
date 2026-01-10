import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { UserProvider } from '../contexts/UserContexts'

const Rootlayout = () => {
    const colorScheme = useColorScheme()

    return (
        <UserProvider>
            <StatusBar style="auto" /> 
            <Stack screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(dashboard)" />
            </Stack>
        </UserProvider>
    )
}

export default Rootlayout