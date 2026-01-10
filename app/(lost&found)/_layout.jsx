import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Tabs } from "expo-router"
import { useRouter } from "expo-router"
import { useColorScheme } from "react-native"
import { colors }  from "../../constants/colors"
import { Ionicons } from "@expo/vector-icons"

import CreatePostModal from '../../components/CreatePostModal'

const LostFoundLayout = () => {
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const router = useRouter()

    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light

  return (
    <>
        <Tabs
            screenOptions={{ 
                headerShown: false, 
                tabBarStyle: { 
                    backgroundColor: theme.navBackground, 
                    borderTopColor: theme.navBorder,
                    paddingTop: 5,
                    height: 60
                },
                tabBarActiveTintColor: theme.iconColorFocused,
                tabBarInactiveTintColor: theme.iconColor
            }}
        >
            <Tabs.Screen 
                name="lost" 
                options={{ 
                    title: 'Home', 
                    tabBarIcon: ({ focused }) => (
                        <Ionicons 
                            size ={24}
                            name={focused ? 'home' : 'home-outline'}
                            color= {focused ? theme.iconColorFocused : theme.iconColor}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            onPress={() => router.replace('/(dashboard)/feed')}
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name="create" 
                options={{ 
                    title: 'Create', 
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            size ={24}
                            name={focused ? 'add-circle' :'add-circle-outline'}
                            color={focused ? theme.iconColorFocused : theme.iconColor}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            onPress={() => setCreateModalVisible(true)}
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name="profile" 
                options={{ 
                    title: 'Profile', 
                    tabBarIcon: ({focused}) => (
                        <Ionicons
                            size ={24}
                            name={focused ? 'person' : 'person-outline'}
                            color={focused ? theme.iconColorFocused : theme.iconColor}
                        />
                    ) 
                }}
            />

            <Tabs.Screen 
                name="found" 
                options={{ 
                    href: null,
                    title: 'Found'
                }}
            />
        </Tabs>

        <CreatePostModal 
            visible={createModalVisible} 
            onClose={() => setCreateModalVisible(false)} 
        />
    </>
  )
}

export default LostFoundLayout
