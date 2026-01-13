import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { colors }  from "../../constants/colors"
import { Ionicons } from "@expo/vector-icons"

// Make sure this path points to your components folder
import CreatePostModal from '../../components/CreatePostModal'

const DashboardLayout = () => {
    // 1. State for the modal
    const [createModalVisible, setCreateModalVisible] = useState(false);

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
                name="feed" 
                options={{ 
                    title: 'Home', 
                    tabBarIcon: ({ focused }) => (
                        <Ionicons 
                            size ={24}
                            name={focused ? 'home' : 'home-outline'}
                            color= {focused ? theme.iconColorFocused : theme.iconColor}
                        />
                    )
                }}
            />

            {/* 2. Modified Create Tab */}
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
                    // This overrides the navigation and opens the modal instead.
                    // Avoid spreading navigator props here so the tab won't be
                    // treated as 'selected' when opening the modal.
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            style={props?.style}
                            accessibilityLabel={props?.accessibilityLabel}
                            onPress={() => setCreateModalVisible(true)}
                        >
                            {props?.children}
                        </TouchableOpacity>
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
        </Tabs>

        {/* 3. The Modal Component */}
        <CreatePostModal 
            visible={createModalVisible} 
            onClose={() => setCreateModalVisible(false)} 
        />
    </>
  )
}

export default DashboardLayout