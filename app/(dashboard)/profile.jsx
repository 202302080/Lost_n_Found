import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Image, View, Alert, TouchableOpacity, ScrollView, Modal, ActivityIndicator, RefreshControl } from 'react-native'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useFocusEffect } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'

import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'
import ThemedTextInput from '../../components/ThemedTextInput'
import { useUser } from '../../hooks/useUser'
import { API_URL, DEFAULT_AVATAR, fixLocalhostUrl } from '../../lib/api'
import { colors } from '../../constants/colors'

const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
}

// fetch() throws on non-JSON bodies (e.g. an HTML error page); read them safely
const readJson = async (res) => {
    try { return await res.json() } catch { return {} }
}

const Profile = () => {
    const router = useRouter()
    const { user, updateUser, logout } = useUser()
    const userId = user?.id || user?._id

    const [tab, setTab] = useState('lost')
    const [posts, setPosts] = useState([])
    const [openMenuId, setOpenMenuId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [savingName, setSavingName] = useState(false)
    const [contactModalVisible, setContactModalVisible] = useState(false)
    const [selectedContact, setSelectedContact] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const avatarUri = fixLocalhostUrl(user?.profilePic) || DEFAULT_AVATAR
    const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Username'

    const pickAndUploadImage = async () => {
        if (!userId) return
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (!permission.granted) {
                Alert.alert('Permission required', 'Please allow access to your photos.')
                return
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            })
            if (result.canceled || !result.assets?.length) return

            const asset = result.assets[0]
            const filename = asset.fileName || asset.uri.split('/').pop() || 'profile.jpg'
            const ext = /\.(\w+)$/.exec(filename)?.[1]?.toLowerCase()
            const type = asset.mimeType || (ext ? `image/${ext === 'jpg' ? 'jpeg' : ext}` : 'image/jpeg')

            const formData = new FormData()
            formData.append('userId', String(userId))
            formData.append('picture', { uri: asset.uri, name: filename, type })

            setUploading(true)
            // Don't set Content-Type: fetch adds the multipart boundary itself
            const res = await fetch(`${API_URL}/auth/profile-picture`, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' },
            })
            const data = await readJson(res)
            if (!res.ok) throw new Error(data.message || 'Server rejected the upload')

            updateUser({ profilePic: data.user.profilePic })
            Alert.alert('Success', 'Profile picture updated!')
        } catch (err) {
            console.log('Upload Error:', err)
            Alert.alert('Error', err.message || 'Could not change profile picture')
        } finally {
            setUploading(false)
        }
    }

    const confirmChangeProfile = () => {
        if (uploading) return
        Alert.alert(
            'Change Profile Picture',
            'Do you want to change your profile picture?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: pickAndUploadImage },
            ]
        )
    }

    const startEditName = () => {
        setFirstName(user?.firstName || '')
        setLastName(user?.lastName || '')
        setEditMode(true)
    }

    const fetchPosts = useCallback(async () => {
        if (!userId) return
        try {
            const response = await axios.get(`${API_URL}/posts/user/${userId}`)
            const myPosts = (response.data?.posts || []).map(post => ({
                ...post,
                id: post._id,
                time: formatTime(post.createdAt),
                imageUrl: fixLocalhostUrl(post.imageUrl || post.image || null),
            }))
            setPosts(myPosts)
        } catch (err) {
            console.error('Error fetching posts:', err)
            setPosts([])
        }
    }, [userId])

    // Load posts on first open and every time the tab regains focus
    // (so a post just created from the Create tab shows up)
    useFocusEffect(
        useCallback(() => {
            let active = true
            setLoading(true)
            fetchPosts().finally(() => { if (active) setLoading(false) })
            return () => { active = false }
        }, [fetchPosts])
    )

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchPosts()
        setRefreshing(false)
    }

    // Logged out (or session lost): go back to the login screen
    useEffect(() => {
        if (!user) router.replace('/login')
    }, [user])

    const saveName = async () => {
        if (!userId) return
        const first = firstName.trim()
        const last = lastName.trim()
        if (!first || !last) {
            Alert.alert('Missing name', 'Please enter both your first and last name.')
            return
        }
        try {
            setSavingName(true)
            const res = await fetch(`${API_URL}/auth/update-name`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, firstName: first, lastName: last }),
            })
            const data = await readJson(res)
            if (!res.ok) throw new Error(data.message || 'Could not update name')

            updateUser({ firstName: data.user.firstName, lastName: data.user.lastName })
            setEditMode(false)
            Alert.alert('Success', 'Name updated')
        } catch (err) {
            Alert.alert('Error', err.message)
        } finally {
            setSavingName(false)
        }
    }

    const deletePost = async (postId) => {
        try {
            const res = await fetch(`${API_URL}/posts/${postId}`, { method: 'DELETE' })
            const data = await readJson(res)
            if (!res.ok) throw new Error(data.message || 'Could not delete post')

            setPosts(prev => prev.filter(p => p._id !== postId))
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

    const confirmLogout = () => {
        Alert.alert('Log out', 'Do you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log out', style: 'destructive', onPress: logout },
        ])
    }

    const filteredPosts = posts.filter(p => p.type === tab)
    const lostCount = posts.filter(p => p.type === 'lost').length
    const foundCount = posts.length - lostCount

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
                                        <ThemedText style={styles.contactValue}>{selectedContact.phone || 'Not provided'}</ThemedText>
                                    </View>
                                </View>

                                <View style={styles.contactItem}>
                                    <Ionicons name="chatbubble" size={20} color="#FF8C00" />
                                    <View style={styles.contactDetail}>
                                        <ThemedText style={styles.contactLabel}>Messenger</ThemedText>
                                        <ThemedText style={styles.contactValue}>{selectedContact.messenger || 'Not provided'}</ThemedText>
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
                <TouchableOpacity onPress={confirmChangeProfile} disabled={uploading}>
                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                    <View style={styles.avatarBadge}>
                        {uploading
                            ? <ActivityIndicator size="small" color="#fff" />
                            : <Ionicons name="camera" size={12} color="#fff" />}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={startEditName} style={{ flex: 1 }} disabled={editMode}>
                    <ThemedText title={true} style={styles.username} numberOfLines={1}>{fullName}</ThemedText>
                    {user?.email ? <ThemedText style={styles.email} numberOfLines={1}>{user.email}</ThemedText> : null}
                    {!editMode && <ThemedText style={{ color: colors.primary }}>Edit Name</ThemedText>}
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="log-out-outline" size={24} color="#d32f2f" />
                </TouchableOpacity>
            </View>

            {editMode && (
                <View style={styles.editSection}>
                    <ThemedTextInput value={firstName} onChangeText={setFirstName} placeholder="First name" style={{ marginBottom: 8 }} />
                    <ThemedTextInput value={lastName} onChangeText={setLastName} placeholder="Last name" style={{ marginBottom: 8 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <ThemedButton onPress={saveName} disabled={savingName} style={[styles.editButton, { marginRight: 8 }]}>
                            {savingName ? 'Saving...' : 'Save'}
                        </ThemedButton>
                        <ThemedButton onPress={() => setEditMode(false)} disabled={savingName} style={[styles.editButton, styles.cancelButton]}>
                            Cancel
                        </ThemedButton>
                    </View>
                </View>
            )}

            <View style={styles.tabRow}>
                <TouchableOpacity style={[styles.tabWrap, tab === 'lost' && styles.activeTabBg]} onPress={() => setTab('lost')}>
                    <ThemedText style={[styles.tabText, tab === 'lost' && styles.tabActiveLost]}>Lost ({lostCount})</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabWrap, tab === 'found' && styles.activeTabBg]} onPress={() => setTab('found')}>
                    <ThemedText style={[styles.tabText, tab === 'found' && styles.tabActiveFound]}>Found ({foundCount})</ThemedText>
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            {/* Posts Area */}
            <ScrollView
                style={styles.postsContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onScrollBeginDrag={() => setOpenMenuId(null)}
            >
                {loading && posts.length === 0 ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
                ) : filteredPosts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>No {tab} posts yet</ThemedText>
                    </View>
                ) : (
                    filteredPosts.map(post => {
                        const borderColor = post.type === 'lost' ? '#ff9800' : '#1b9a21'
                        return (
                            <React.Fragment key={post._id}>
                                <ThemedCard style={styles.postCard}>
                                <View style={styles.postHeader}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <Image source={{ uri: avatarUri }} style={styles.headerAvatar} />
                                        <View style={{ marginLeft: 10, flex: 1 }}>
                                            <ThemedText style={styles.headerTitle}>{`${fullName} posted a ${post.type} item: ${post.item}`}</ThemedText>
                                            <ThemedText style={styles.headerTime}>{post.time}</ThemedText>
                                        </View>
                                    </View>
                                    <View style={{ position: 'relative' }}>
                                        <TouchableOpacity onPress={() => setOpenMenuId(openMenuId === post._id ? null : post._id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                            <Ionicons name="ellipsis-vertical" size={20} color="#444" />
                                        </TouchableOpacity>
                                        {openMenuId === post._id ? (
                                            <View style={styles.overflowMenu}>
                                                <TouchableOpacity onPress={() => { setOpenMenuId(null); confirmDeletePost(post._id) }} style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                                                    <Ionicons name="trash-outline" size={16} color="#d32f2f" style={{ marginRight: 6 }} />
                                                    <ThemedText style={styles.deleteText}>Delete</ThemedText>
                                                </TouchableOpacity>
                                            </View>
                                        ) : null}
                                    </View>
                                </View>

                                {post.imageUrl ? (
                                    <View style={[styles.imageWrapper, { borderColor }]}>
                                        <Image source={{ uri: post.imageUrl }} style={styles.postImage} resizeMode="cover" />
                                    </View>
                                ) : (
                                    <View style={[styles.imageWrapper, styles.noImage, { borderColor }]}>
                                        <Ionicons name="image-outline" size={40} color="#bbb" />
                                        <ThemedText style={styles.emptyText}>No image</ThemedText>
                                    </View>
                                )}

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
                                        <ThemedText style={[styles.contactText, { flex: 1 }]}>{post.description || 'No description'}</ThemedText>
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
    email: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    avatarBadge: {
        position: 'absolute',
        right: 10,
        bottom: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    logoutButton: {
        padding: 6,
        marginLeft: 8,
    },
    editButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        marginVertical: 0,
    },
    cancelButton: {
        backgroundColor: '#888',
    },
    noImage: {
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
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
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
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
        aspectRatio: 1,
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