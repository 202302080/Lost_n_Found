import React, { useState } from 'react'; 
import { StyleSheet, View, TouchableOpacity, Image, FlatList, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons' 
import { useRouter } from 'expo-router'

import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'

const POSTS = [
    {
        id: '1',
        user: 'RomarDelaCruz',
        type: 'lost',
        time: '1 min ago',
        image: 'https://images.playstation.com/is/image/pswstatic/ps4-dualshock-4-listing-thumb-01-en-11sep18?$facebook$',
        contact: '0912-***-***0',
        messenger: 'romardelacruz',
        lastSeen: 'CCL 305',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg' // Added avatar for chat
    },
    {
        id: '2',
        user: 'JohnwilVerano',
        type: 'found',
        time: '1 min ago',
        image: 'https://m.media-amazon.com/images/I/61N-U7M3LpL._AC_SL1500_.jpg',
        contact: '0912-***-***0',
        messenger: 'johnwilverano',
        lastSeen: 'DIT 1st Floor',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg' // Added avatar for chat
    }
]

const Home = () => {
    const router = useRouter();
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                {/* Displaying user avatar if available */}
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <ThemedText style={styles.username}>
                        <ThemedText style={{ fontWeight: 'bold' }}>{item.user}</ThemedText> posted a {item.type} item
                    </ThemedText>
                    <ThemedText style={styles.timestamp}>{item.time}</ThemedText>
                </View>
                <Ionicons name="ellipsis-horizontal" size={20} color="black" />
            </View>

            <Image source={{ uri: item.image }} style={[styles.postImage, { borderColor: item.type === 'lost' ? '#FF8C00' : '#32CD32' }]} />

            <View style={styles.postDetails}>
                <ThemedText style={styles.detailText}>Contact No.: {item.contact}</ThemedText>
                <ThemedText style={styles.detailText}>Messenger: {item.messenger}</ThemedText>
                <ThemedText style={styles.detailText}>Description: {item.lastSeen}</ThemedText>
            </View>

            {/* UPDATED MESSAGE BUTTON: Navigates to Chat and passes user data */}
            <TouchableOpacity 
                style={[styles.messageButton, { backgroundColor: item.type === 'lost' ? '#FF9130' : '#39D353' }]}
                onPress={() => router.push({
                    pathname: '/(messages)/chat',
                    params: { 
                        userName: item.user, 
                        userAvatar: item.avatar 
                    }
                })}
            >
                <ThemedText style={styles.messageButtonText}>Message {item.user.split(' ')[0]}</ThemedText>
            </TouchableOpacity>
        </View>
    )

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.sideContainer}>
                    <TouchableOpacity onPress={() => setIsSearching(!isSearching)}>
                        <Ionicons name={isSearching ? "close" : "search"} size={26} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.centerContainer}>
                    {isSearching ? (
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search posts..."
                            value={searchText}
                            onChangeText={setSearchText}
                            autoFocus
                        />
                    ) : (
                        <View style={styles.tabContainer}>
                            <TouchableOpacity 
                                style={styles.tab} 
                                onPress={() => router.push('/(lost&found)/lost')}
                            >
                                <ThemedText style={styles.tabText}>LOST</ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.tab} 
                                onPress={() => router.push('/(lost&found)/found')}
                            >
                                <ThemedText style={styles.tabText}>FOUND</ThemedText>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>



            </View>

            <FlatList
                data={POSTS}
                keyExtractor={item => item.id}
                renderItem={renderPost}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </ThemedView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#C4C4C4',
        paddingTop: 50, 
        paddingBottom: 15,
        paddingHorizontal: 15,
    },
    sideContainer: { width: 40, alignItems: 'flex-start' },
    sideContainerRight: { width: 40, alignItems: 'flex-end' },
    centerContainer: { flex: 1, alignItems: 'center' },
    tabContainer: { flexDirection: 'row', gap: 30 },
    tab: { paddingVertical: 5 },
    tabText: { fontWeight: 'bold', fontSize: 18 },
    searchInput: {
        backgroundColor: '#fff',
        width: '95%',
        height: 35,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 14,
    },
    postCard: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DDD' },
    username: { fontSize: 13 },
    timestamp: { fontSize: 11, color: '#888' },
    postImage: { width: '100%', height: 220, borderRadius: 40, borderWidth: 3, marginBottom: 10 },
    postDetails: { paddingHorizontal: 10, marginBottom: 10 },
    detailText: { fontSize: 13, marginBottom: 2 },
    messageButton: { paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
    messageButtonText: { color: '#fff', fontWeight: 'bold' }
})