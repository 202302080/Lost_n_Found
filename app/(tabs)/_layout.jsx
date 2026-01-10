import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native'; // Added TouchableOpacity
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CreatePostModal from '../../components/CreatePostModal'; 

export default function TabLayout() {
  const [createModalVisible, setCreateModalVisible] = useState(false);

  return (
    <>
      <Tabs screenOptions={{ tabBarActiveTintColor: '#F28C28' }}>
        <Tabs.Screen
          name="/dashboard/feed"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
          }}
        />

        {/* FIX: We use 'tabBarButton' to override the default navigation behavior completely */}
        <Tabs.Screen
          name="create" 
          options={{
            title: 'Create',
            tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={32} color={color} />,
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  console.log("Custom button pressed!");
                  setCreateModalVisible(true);
                }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />,
          }}
        />
      </Tabs>

      <CreatePostModal 
        visible={createModalVisible} 
        onClose={() => setCreateModalVisible(false)} 
      />
    </>
  );
}