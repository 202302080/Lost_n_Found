import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Image, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'

const LOST_DATA = [
    {
        id: '1',
        user: 'RomarDelaCruz',
        time: '1 min ago',
        image: 'https://images.playstation.com/is/image/pswstatic/ps4-dualshock-4-listing-thumb-01-en-11sep18?$facebook$',
        contact: '0912-***-***0',
        messenger: 'romardelacruz',
        lastSeen: 'CCL 305'
    }
]

const LostScreen = () => {
    const router = useRouter();
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <View style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <ThemedText style={styles.username}>
                        <ThemedText style={{ fontWeight: 'bold' }}>{item.user}</ThemedText> posted a lost item
                    </ThemedText>
                    <ThemedText style={styles.timestamp}>{item.time}</ThemedText>
                </View>
                <Ionicons name="ellipsis-horizontal" size={20} color="black" />
            </View>

            <Image source={{ uri: item.image }} style={styles.postImage} />

            <View style={styles.postDetails}>
                <ThemedText style={styles.detailText}>Contact No.: {item.contact}</ThemedText>
                <ThemedText style={styles.detailText}>Messenger: {item.messenger}</ThemedText>
                <ThemedText style={styles.detailText}>Last seen: {item.lastSeen}</ThemedText>
            </View>

            <TouchableOpacity style={styles.messageButton}>
                <ThemedText style={styles.messageButtonText}>Message Romar</ThemedText>
            </TouchableOpacity>
        </View>
    )

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                {/* UPPER LEFT: SEARCH BUTTON */}
                <View style={styles.sideContainer}>
                    <TouchableOpacity onPress={() => setIsSearching(!isSearching)}>
                        <Ionicons name={isSearching ? "close" : "search"} size={26} color="black" />
                    </TouchableOpacity>
                </View>

                {/* CENTERED TABS OR SEARCH INPUT */}
                <View style={styles.centerContainer}>
                    {isSearching ? (
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search lost items..."
                            value={searchText}
                            onChangeText={setSearchText}
                            autoFocus
                        />
                    ) : (
                        <View style={styles.tabContainer}>
                            <TouchableOpacity style={styles.tab}>
                                <ThemedText style={[styles.tabText, styles.activeLostText]}>LOST</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.replace('/(lost&found)/found')} style={styles.tab}>
                                <ThemedText style={styles.tabText}>FOUND</ThemedText>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* UPPER RIGHT: BACK BUTTON */}
                <View style={styles.sideContainerRight}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={26} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList 
                data={LOST_DATA} 
                renderItem={renderPost} 
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </ThemedView>
    )
}

export default LostScreen

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#C4C4C4', 
        paddingTop: 50, 
        paddingBottom: 15, 
        paddingHorizontal: 15 
    },
    sideContainer: {
        width: 40,
        alignItems: 'flex-start',
    },
    sideContainerRight: {
        width: 40,
        alignItems: 'flex-end',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
    },
    tabContainer: { 
        flexDirection: 'row', 
        gap: 30
    },
    tabText: { fontSize: 18, fontWeight: '500' },
    activeLostText: { color: '#FF8C00', fontWeight: 'bold' },
    searchInput: {
        backgroundColor: '#fff',
        width: '90%',
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
    postImage: { 
        width: '100%', 
        height: 220, 
        borderRadius: 40, 
        borderWidth: 3, 
        borderColor: '#FF8C00', 
        marginBottom: 10 
    },
    postDetails: { paddingHorizontal: 10, marginBottom: 10 },
    detailText: { fontSize: 13, marginBottom: 2 },
    messageButton: { backgroundColor: '#FF9130', paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
    messageButtonText: { color: '#fff', fontWeight: 'bold' }
})