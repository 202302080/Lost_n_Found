import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { colors } from "../constants/colors"
import { StatusBar } from 'expo-status-bar'
import { UserProvider } from '../contexts/UserContexts'

const Rootlayout = () => {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light

    return (
        <UserProvider>
            {/* Set style to auto or match your theme (light/dark) */}
            <StatusBar style="auto" /> 
            
            <Stack screenOptions={{
                // Hide the header by default to prevent the "double header" look
                headerShown: false, 
                contentStyle: { backgroundColor: theme.background }
            }}>
                <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(dashboard)" />
                {/* If (lost&found) is a group, ensure its internal 
                   _layout.js also handles its specific header needs.
                */}
            </Stack>
        </UserProvider>
    )
}

export default Rootlayout