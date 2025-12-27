import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { colors }  from "../../constants/colors"
import { Ionicons } from "@expo/vector-icons"

const DashboardLayout = () => {

    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light


  return (
    <Tabs
        screenOptions={{ headerShown: false, tabBarStyle: { 
            backgroundColor: theme.navBackground, 
            borderTopColor: theme.navBorder,
            paddingTop: 10,
            height: 90
        
        },
        tabBarActiveTintColor: theme.iconColorFocused,
        tabBarInactiveTintColor: theme.iconColor
    }}
    >
        <Tabs.Screen 
        name="feed" 
        options={{ title: 'Home', tabBarIcon: ({ focused }) => (
            <Ionicons 
                size ={24}
                name={focused ? 'home' : 'home-outline'}
                color= {focused ? theme.iconColorFocused : theme.iconColor}
            
            />
        )}}
         />


        <Tabs.Screen 
        name="create" 
        options={{ title: 'Create', tabBarIcon: ({ focused }) => (
            <Ionicons
                size ={24}
                name={focused ? 'add-circle' :'add-circle-outline'}
                color={focused ? theme.iconColorFocused : theme.iconColor}
            />
        ) }}/>


        <Tabs.Screen 
        name="profile" 
        options={{ title: 'Profile', tabBarIcon: ({focused}) => (
            <Ionicons
                size ={24}
                name={focused ? 'person' : 'person-outline'}
                color={focused ? theme.iconColorFocused : theme.iconColor}
            />
        ) }}/>


        <Tabs.Screen 
        name="contacts" 
        options={{ title: 'Contacts', tabBarIcon: ({focused}) => (
            <Ionicons
                size ={24}
                name={focused ? 'people' : 'people-outline'}
                color={focused ? theme.iconColorFocused : theme.iconColor}
            />

        ) }}/>

        <Tabs.Screen 
        name="notifications" 
        options={{ title: 'Notifications', tabBarIcon: ({ focused }) => (
            <Ionicons
                size ={24}
                name={focused ? 'notifications' : 'notifications-outline'}
                color={focused ? theme.iconColorFocused : theme.iconColor}
            />

        ) }}/>


    </Tabs>

    
    
  )
}

export default DashboardLayout