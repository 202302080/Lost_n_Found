import React, { useState, useEffect } from 'react'; 
import { StyleSheet, Image, View, Alert, TouchableOpacity, ScrollView, Modal } from 'react-native'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'

import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'
import ThemedTextInput from '../../components/ThemedTextInput'
import { useUser } from '../../hooks/useUser'
import { API_URL, fixLocalhostUrl } from '../../lib/api' // Ensure fixLocalhostUrl is exported
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../constants/colors'

const Profile = () => {
    const [tab, setTab] = useState('lost')
    const [profilePic, setProfilePic] = useState(null);
    const { user, updateUser } = useUser()
    const [posts, setPosts] = useState([])
    const [openMenuId, setOpenMenuId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [contactModalVisible, setContactModalVisible] = useState(false)
    const [selectedContact, setSelectedContact] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const pickAndUploadImage = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission required', 'Please allow access to your photos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType.Images, 
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (result.canceled || !result.assets) return;

            const localUri = result.assets[0].uri;
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            const formData = new FormData();
            
            // Match the backend field name 'picture'
            formData.append('picture', {
                uri: localUri,
                name: filename,
                type: type,
            });

            // Use _id for MongoDB compatibility
            formData.append('userId', user?._id || user?.id);

            // Since API_URL already ends in /api, we only add /auth/...
            const res = await fetch(`${API_URL}/auth/profile-picture`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    // Note: We don't set Content-Type; the browser does it for FormData
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Server rejected the upload');
            }

            const newUrl = fixLocalhostUrl(data.user.profilePic);
            setProfilePic(newUrl);
            
            if (typeof updateUser === 'function') {
                updateUser({ ...user, profilePic: newUrl });
            }
            
            Alert.alert('Success', 'Profile picture updated!');

        } catch (err) {
            console.log("Upload Error:", err);
            Alert.alert('Error', err.message || 'Could not change profile picture');
        }
    };

    const confirmChangeProfile = () => {
        Alert.alert(
            'Change Profile Picture',
            'Do you want to change your profile picture?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: pickAndUploadImage },
            ]
        )
    }

    const formatTime = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        const diff = Date.now() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 1) return 'just now'
        if (minutes < 60) return `${minutes}m`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h`
        const days = Math.floor(hours / 24)
        return `${days}d`
    }

    const confirmChangeName = () => {
        Alert.alert(
            'Change Name',
            'Do you want to change your name?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: () => setEditMode(true) },
            ]
        )
    }

    useEffect(() => {
        if (!user) return
        setFirstName(user.firstName || '')
        setLastName(user.lastName || '')

        let mounted = true
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${API_URL}/posts/all`)

                if (!mounted) return

                if (response.data && response.data.posts) {
                    const formattedPosts = response.data.posts.map(post => ({
                        ...post,
                        id: post._id,
                        _id: post._id,
                        time: formatTime(post.createdAt),
                        location: post.location || 'Not specified',
                        description: post.description || 'No description',
                        avatar: post.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
                        image: post.imageUrl || 'https://via.placeholder.com/300?text=No+Image',
                        imageUrl: post.imageUrl || (post.image || null),
                    }))

                    // Keep only current user's posts
                    const myId = user._id || user.id
                    const myPosts = formattedPosts.filter(p => {
                        const uid = p.userId ? (typeof p.userId === 'object' ? (p.userId._id || p.userId.id) : p.userId) : null
                        return String(uid) === String(myId)
                    })

                    setPosts(myPosts.map(p => ({ ...p, imageUrl: fixLocalhostUrl(p.imageUrl) })))
                }
            } catch (err) {
                console.error('Error fetching posts:', err)
                if (mounted) setPosts([])
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchPosts()
        return () => { mounted = false }
    }, [user])

    const saveName = async () => {
        if (!user) return
        try {
            const res = await fetch(`${API_URL}/auth/update-name`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, firstName, lastName })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            updateUser({ firstName: data.user.firstName, lastName: data.user.lastName })
            Alert.alert('Success', 'Name updated')
            setEditMode(false)
        } catch (err) {
            Alert.alert('Error', err.message)
        }
    }

    const deletePost = async (postId) => {
        try {
            const res = await fetch(`${API_URL}/posts/${postId}`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Could not delete post')

            // Remove from local state
            setPosts(prev => prev.filter(p => (p._id || p.id) !== postId))
            Alert.alert('Deleted', 'Post deleted successfully')
        } catch (err) {
            console.log('Delete error', err)
            Alert.alert('Error', err.message || 'Failed to delete post')
        }
    }

    const confirmDeletePost = (postId) => {
        Alert.alert(
            'Delete post',
            'Are you sure you want to delete this post? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deletePost(postId) },
            ]
        )
    }

    const filteredPosts = posts.filter(p => p.type === tab)

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
                                    <Ionicons name="call" size={20} color="#FF8C00" />
                                    <View style={styles.contactDetail}>
                                        <ThemedText style={styles.contactLabel}>Phone Number</ThemedText>
                                        <ThemedText style={styles.contactValue}>{selectedContact.phone}</ThemedText>
                                    </View>
                                </View>

                                <View style={styles.contactItem}>
                                    <Ionicons name="chatbubble" size={20} color="#FF8C00" />
                                    <View style={styles.contactDetail}>
                                        <ThemedText style={styles.contactLabel}>Messenger</ThemedText>
                                        <ThemedText style={styles.contactValue}>{selectedContact.messenger}</ThemedText>
                                    </View>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setContactModalVisible(false)}
                        >
                            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Profile Header */}
            <View style={styles.topCenter}>
                <TouchableOpacity onPress={confirmChangeProfile}>
                    <Image
                        source={{ uri: profilePic || fixLocalhostUrl(user?.profilePic) || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmChangeName} style={{ flex: 1 }}>
                    <ThemedText title={true} style={styles.username}>
                        {user ? `${user.firstName} ${user.lastName}` : 'Username'}
                    </ThemedText>
                    <ThemedText style={{ color: colors.primary }}>Edit Name</ThemedText>
                </TouchableOpacity>
            </View>

            {editMode && (
                <View style={styles.editSection}>
                    <ThemedTextInput value={firstName} onChangeText={setFirstName} placeholder="First name" style={{ marginBottom: 8 }} />
                    <ThemedTextInput value={lastName} onChangeText={setLastName} placeholder="Last name" style={{ marginBottom: 8 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <ThemedButton onPress={saveName} style={{ marginRight: 8 }}>Save</ThemedButton>
                        <ThemedButton onPress={() => setEditMode(false)} variant="secondary">Cancel</ThemedButton>
                    </View>
                </View>
            )}

            <View style={styles.tabRow}>
                <TouchableOpacity style={[styles.tabWrap, tab === 'lost' && styles.activeTabBg]} onPress={() => setTab('lost')}>
                    <ThemedText style={[styles.tabText, tab === 'lost' && styles.tabActiveLost]}>Lost</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabWrap, tab === 'found' && styles.activeTabBg]} onPress={() => setTab('found')}>
                    <ThemedText style={[styles.tabText, tab === 'found' && styles.tabActiveFound]}>Found</ThemedText>
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            {/* Posts Area */}
            <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ThemedText style={styles.emptyText}>Loading...</ThemedText>
                ) : filteredPosts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>No posts yet so far</ThemedText>
                    </View>
                ) : (
                    filteredPosts.map(post => {
                        const borderColor = post.type === 'lost' ? '#ff9800' : '#1b9a21'
                        const avatarUri = post.avatar ? fixLocalhostUrl(post.avatar) : (profilePic || fixLocalhostUrl(user?.profilePic) || 'https://randomuser.me/api/portraits/men/1.jpg')
                        const imageUri = post.imageUrl ? fixLocalhostUrl(post.imageUrl) : (post.image ? fixLocalhostUrl(post.image) : 'https://via.placeholder.com/600x400?text=No+Image')
                        return (
                            <React.Fragment key={post._id || post.id}>
                                <ThemedCard style={styles.postCard}>
                                <View style={styles.postHeader}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={{ uri: avatarUri }} style={styles.headerAvatar} />
                                        <View style={{ marginLeft: 10 }}>
                                            <ThemedText style={styles.headerTitle}>{user ? `${user.firstName} ${user.lastName} posted a ${post.type} item` : post.item}</ThemedText>
                                            <ThemedText style={styles.headerTime}>{post.time || ''}</ThemedText>
                                        </View>
                                    </View>
                                    <View style={{ position: 'relative' }}>
                                        <TouchableOpacity onPress={() => setOpenMenuId(openMenuId === (post._id || post.id) ? null : (post._id || post.id))} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                            <Ionicons name="ellipsis-vertical" size={20} color="#444" />
                                        </TouchableOpacity>
                                        {openMenuId === (post._id || post.id) ? (
                                            <View style={styles.overflowMenu}>
                                                <TouchableOpacity onPress={() => { setOpenMenuId(null); confirmDeletePost(post._id || post.id); }} style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                                                        <Ionicons name="trash-outline" size={16} color="#d32f2f" style={{ marginRight: 6 }} />
                                                        <ThemedText style={styles.deleteText}>Delete</ThemedText>
                                                    </TouchableOpacity>
                                            </View>
                                        ) : null}
                                    </View>
                                </View>

                                <View style={[styles.imageWrapper, { borderColor }]}>
                                    <Image source={{ uri: imageUri }} style={styles.postImage} resizeMode="cover" />
                                </View>

                                <View style={styles.contactSection}>
                                    <View style={styles.contactRow}>
                                        <Ionicons name="call-outline" size={20} color="#666" style={styles.contactIcon} />
                                        <ThemedText style={styles.contactText}>{post.contact || 'No contact'}</ThemedText>
                                    </View>
                                    <View style={styles.contactRow}>
                                        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#666" style={styles.contactIcon} />
                                        <ThemedText style={styles.contactText}>{post.messenger || 'No messenger'}</ThemedText>
                                    </View>
                                    <View style={styles.contactRow}>
                                        <Ionicons name="location-outline" size={20} color="#666" style={styles.contactIcon} />
                                        <ThemedText style={styles.contactText}>{post.location || 'Not specified'}</ThemedText>
                                    </View>
                                    <View style={styles.contactRow}>
                                        <Ionicons name="document-text-outline" size={20} color="#666" style={styles.contactIcon} />
                                        <ThemedText style={styles.contactText}>{post.description || 'No description'}</ThemedText>
                                    </View>
                                </View>

                                <TouchableOpacity 
                                    style={[styles.messageButton, { backgroundColor: post.type === 'lost' ? '#FF9130' : '#39D353' }]}
                                    onPress={() => {
                                        setSelectedContact({ phone: post.contact, messenger: post.messenger })
                                        setContactModalVisible(true)
                                    }}
                                >
                                    <ThemedText style={styles.messageButtonText}>View Contact Details</ThemedText>
                                </TouchableOpacity>
                                </ThemedCard>
                                <View style={styles.dividerLine} />
                            </React.Fragment>
                        )
                    })
                )}
                <Spacer height={40} />
            </ScrollView>
        </ThemedView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    topCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    editSection: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginBottom: 12,
    },
    tabWrap: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    tabActiveLost: { color: '#ee7f00' },
    tabActiveFound: { color: '#1b9a21' },
    activeTabBg: { backgroundColor: '#f0f0f0' },
    postsContainer: {
        flex: 1,
    },
    // HEIGHT INCREASED HERE
    postCard: {
        marginBottom: 0,
        minHeight: 0,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 18,
        justifyContent: 'flex-start',
        borderRadius: 0,
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        backgroundColor: 'transparent',
    },
    cardTitle: {
        fontSize: 18,
    },
    cardDesc: {
        marginTop: 8,
        color: '#555',
        lineHeight: 20,
    },
    cardType: {
        marginTop: 10,
        color: '#888',
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#fff',
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    headerTime: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    imageWrapper: {
        borderWidth: 4,
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 12,
    },
    postImage: {
        width: '100%',
        height: 200,
    },
    contactSection: {
        marginBottom: 12,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactIcon: {
        marginRight: 10,
    },
    contactText: {
        color: '#555',
        fontSize: 14,
    },
    ctaButton: {
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    ctaText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    overflowMenu: {
        position: 'absolute',
        right: 0,
        top: 26,
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        minWidth: 110,
        alignItems: 'center',
        borderRadius: 8,
        elevation: 20,
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    deleteText: {
        color: '#d32f2f',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
    },
    messageButton: { paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
    messageButtonText: { color: '#fff', fontWeight: 'bold' },
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
    contactInfo: { marginVertical: 10 },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    contactDetail: { marginLeft: 15, flex: 1 },
    contactLabel: { fontSize: 12, color: '#999', marginBottom: 3 },
    contactValue: { fontSize: 14, fontWeight: '600', color: '#333' },
    closeButton: { backgroundColor: '#FF8C00', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 15 },
    closeButtonText: { color: '#fff', fontWeight: 'bold' },
    emptyContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
    },
    dividerLine: {
        height: 1,
        backgroundColor: '#cfcfcf',
        marginVertical: 0,
        marginLeft: -20,
        marginRight: -20,
        alignSelf: 'stretch',
    },
})