import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Image, TextInput, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import PostOptionsMenu from '../../components/PostOptionsMenu';
import { API_URL } from '../../lib/api';


const FoundScreen = () => {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    const fetchFoundPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/posts/type/found`);
            
            if (response.data.posts) {
                // Format posts to include calculated timestamps
                const formattedPosts = response.data.posts.map(post => ({
                    ...post,
                    id: post._id,
                    time: formatTime(post.createdAt),
                    location: post.location || 'Not specified',
                    description: post.description || 'No description',
                    avatar: post.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
                    image: post.imageUrl || 'https://via.placeholder.com/300?text=No+Image'
                }));
                setPosts(formattedPosts);
            }
        } catch (error) {
            console.error('Error fetching found items:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    };

    // Fetch posts when component mounts and when screen is focused
    useEffect(() => {
        fetchFoundPosts();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchFoundPosts();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFoundPosts();
        setRefreshing(false);
    };

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <ThemedText style={styles.username}>
                        <ThemedText style={{ fontWeight: 'bold' }}>{item.user}</ThemedText> posted a found item
                    </ThemedText>
                    <ThemedText style={styles.timestamp}>{item.time}</ThemedText>
                </View>
                <PostOptionsMenu postId={item.id} onPostDeleted={fetchFoundPosts} />
            </View>

            <Image source={{ uri: item.image }} style={styles.postImage} />

            <View style={styles.postDetails}>
                <View style={styles.detailRow}>
                    <Ionicons name="call" size={18} color="#666" style={styles.detailIcon} />
                    <ThemedText style={styles.detailText}>{item.contact}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="chatbubble" size={18} color="#666" style={styles.detailIcon} />
                    <ThemedText style={styles.detailText}>{item.messenger}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="location" size={18} color="#666" style={styles.detailIcon} />
                    <ThemedText style={styles.detailText}>{item.location}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="document-text" size={18} color="#666" style={styles.detailIcon} />
                    <ThemedText style={styles.detailText}>{item.description}</ThemedText>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.messageButton}
                onPress={() => {
                    setSelectedContact({
                        phone: item.contact,
                        messenger: item.messenger
                    });
                    setContactModalVisible(true);
                }}
            >
                <ThemedText style={styles.messageButtonText}>View Contact Details</ThemedText>
            </TouchableOpacity>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            {/* Contact Details Modal */}
            <Modal
                transparent={true}
                visible={contactModalVisible}
                animationType="fade"
                onRequestClose={() => setContactModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.contactModal}>
                        <View style={styles.modalHeader}>
                            <ThemedText style={styles.modalTitle}>Contact Details</ThemedText>
                            <TouchableOpacity onPress={() => setContactModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {selectedContact && (
                            <View style={styles.contactInfo}>
                                <View style={styles.contactItem}>
                                    <Ionicons name="call" size={20} color="#32CD32" />
                                    <View style={styles.contactDetail}>
                                        <ThemedText style={styles.contactLabel}>Phone Number</ThemedText>
                                        <ThemedText style={styles.contactValue}>{selectedContact.phone}</ThemedText>
                                    </View>
                                </View>

                                <View style={styles.contactItem}>
                                    <Ionicons name="chatbubble" size={20} color="#32CD32" />
                                    <View style={styles.contactDetail}>
                                        <ThemedText style={styles.contactLabel}>Messenger Username</ThemedText>
                                        <ThemedText style={styles.contactValue}>{selectedContact.messenger}</ThemedText>
                                    </View>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity 
                            style={[styles.closeButton, { backgroundColor: '#32CD32' }]}
                            onPress={() => setContactModalVisible(false)}
                        >
                            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.header}>
                {/* CENTERED TABS OR SEARCH INPUT */}
                <View style={styles.centerContainer}>
                    
                        <View style={styles.tabContainer}>
                            <TouchableOpacity onPress={() => router.replace('/(lost&found)/lost')}>
                                <ThemedText style={styles.tabText}>LOST</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <ThemedText style={[styles.tabText, styles.activeFoundText]}>FOUND</ThemedText>
                            </TouchableOpacity>
                        </View>
                    
                </View>

                {/* UPPER RIGHT: EMPTY SPACE FOR ALIGNMENT */}
                <View style={styles.sideContainerRight}>
                </View>
            </View>

            <FlatList 
                data={posts} 
                renderItem={renderPost} 
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#32CD32']}
                        tintColor="#32CD32"
                    />
                }
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#32CD32" />
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <ThemedText style={styles.emptyText}>No found items yet</ThemedText>
                        </View>
                    )
                }
            />
        </ThemedView>
    );
}

export default FoundScreen;

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
    activeFoundText: { color: '#32CD32', fontWeight: 'bold' },
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
    postImage: { width: '100%', height: 220, borderRadius: 40, borderWidth: 3, borderColor: '#32CD32', marginBottom: 10 },
    postDetails: { paddingHorizontal: 10, marginBottom: 10 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    detailIcon: { marginRight: 8, width: 20 },
    detailText: { fontSize: 13, marginBottom: 2 },
    messageButton: { backgroundColor: '#39D353', paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
    messageButtonText: { color: '#fff', fontWeight: 'bold' },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactModal: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '80%',
        maxWidth: 350,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    contactInfo: {
        marginVertical: 10,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    contactDetail: {
        marginLeft: 15,
        flex: 1,
    },
    contactLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 3,
    },
    contactValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});