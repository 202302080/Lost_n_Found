import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';

const MESSAGE_DATA = [
    {
        id: '1',
        name: 'Romar Dela Cruz',
        lastMessage: 'Is the PS4 controller still available?',
        time: '2m ago',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        unread: true,
    },
    {
        id: '2',
        name: 'Johnwil Verano',
        lastMessage: 'I found your ID at the DIT 1st floor.',
        time: '1h ago',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        unread: false,
    },
];

const Messages = () => {
    const router = useRouter();

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() => router.push({
                pathname: '/(messages)/chat',
                params: { 
                    userName: item.name, 
                    userAvatar: item.avatar 
                }
            })}
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            
            <View style={styles.textContainer}>
                <View style={styles.row}>
                    <ThemedText style={[styles.name, item.unread && styles.boldText]}>
                        {item.name}
                    </ThemedText>
                    <ThemedText style={styles.time}>{item.time}</ThemedText>
                </View>
                <ThemedText numberOfLines={1} style={[styles.lastMessage, item.unread && styles.unreadText]}>
                    {item.lastMessage}
                </ThemedText>
            </View>

            {item.unread && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText style={styles.heading}>Messages</ThemedText>
                <TouchableOpacity>
                    <Ionicons name="create-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={MESSAGE_DATA}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listPadding}
            />
        </ThemedView>
    );
};

export default Messages;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    heading: { fontWeight: 'bold', fontSize: 28 },
    listPadding: { paddingHorizontal: 15 },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#DDD' },
    textContainer: { flex: 1, marginLeft: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    name: { fontSize: 16 },
    time: { fontSize: 12, color: '#888' },
    lastMessage: { fontSize: 14, color: '#666' },
    boldText: { fontWeight: 'bold' },
    unreadText: { color: '#000', fontWeight: '500' },
    unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#39D353', marginLeft: 10 },
});