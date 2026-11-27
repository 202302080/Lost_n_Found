import React from 'react'
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import ThemedText from './ThemedText'
import PostOptionsMenu from './PostOptionsMenu'
import { DEFAULT_AVATAR, fixLocalhostUrl } from '../lib/api'

export const TYPE_THEME = {
    lost: { accent: '#F28C28', soft: '#FFF3E6', label: 'LOST' },
    found: { accent: '#28A745', soft: '#E9F7EC', label: 'FOUND' },
}

const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const diffMs = Date.now() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
}

// Turn a post from the API into what the card shows
export const formatPost = (post) => ({
    ...post,
    id: post._id,
    user: (post.user || '').replace(/\s+/g, ' ').trim(),
    time: formatTime(post.createdAt),
    location: post.location || 'Not specified',
    description: post.description || 'No description',
    avatar: fixLocalhostUrl(post.userId?.profilePic || post.avatar) || DEFAULT_AVATAR,
    image: fixLocalhostUrl(post.imageUrl) || null,
})

const Detail = ({ icon, children, lines = 1 }) => (
    <View style={styles.detailRow}>
        <Ionicons name={icon} size={15} color="#888" style={styles.detailIcon} />
        <ThemedText style={styles.detailText} numberOfLines={lines}>{children}</ThemedText>
    </View>
)

const PostCard = ({ item, onDeleted, onViewContact, style }) => {
    const theme = TYPE_THEME[item.type] || TYPE_THEME.lost

    return (
        <View style={[styles.card, style]}>
            {/* Poster */}
            <View style={styles.header}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <ThemedText style={styles.userName} numberOfLines={1}>{item.user}</ThemedText>
                    <ThemedText style={styles.timestamp}>{item.time}</ThemedText>
                </View>
                <PostOptionsMenu postId={item.id} onPostDeleted={onDeleted} />
            </View>

            {/* Photo with LOST / FOUND badge */}
            <View style={styles.imageWrap}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={[styles.image, styles.noImage]}>
                        <Ionicons name="image-outline" size={40} color="#bbb" />
                        <ThemedText style={styles.noImageText}>No photo</ThemedText>
                    </View>
                )}
                <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                    <ThemedText style={styles.badgeText}>{theme.label}</ThemedText>
                </View>
            </View>

            {/* Details */}
            <View style={styles.body}>
                <ThemedText style={styles.itemName} numberOfLines={1}>{item.item || 'Item'}</ThemedText>
                <Detail icon="location">{item.location}</Detail>
                <Detail icon="document-text" lines={2}>{item.description}</Detail>
            </View>

            <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: theme.soft, borderColor: theme.accent }]}
                onPress={() => onViewContact({ phone: item.contact, messenger: item.messenger, type: item.type })}
            >
                <Ionicons name="call" size={16} color={theme.accent} />
                <ThemedText style={[styles.contactButtonText, { color: theme.accent }]}>Contact</ThemedText>
            </TouchableOpacity>
        </View>
    )
}

export default React.memo(PostCard)

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ececec',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ddd' },
    userName: { fontSize: 14, fontWeight: 'bold', color: '#222' },
    timestamp: { fontSize: 11, color: '#999', marginTop: 1 },
    imageWrap: { borderRadius: 12, overflow: 'hidden', marginBottom: 10 },
    image: { width: '100%', aspectRatio: 1, backgroundColor: '#f0f0f0' },
    noImage: { alignItems: 'center', justifyContent: 'center' },
    noImageText: { color: '#aaa', marginTop: 4, fontSize: 12 },
    badge: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
    body: { marginBottom: 10 },
    itemName: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 6 },
    detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
    detailIcon: { marginRight: 6, marginTop: 2, width: 16 },
    detailText: { fontSize: 13, color: '#555', flex: 1 },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 9,
        borderRadius: 20,
        borderWidth: 1,
    },
    contactButtonText: { fontWeight: 'bold', fontSize: 14 },
})
