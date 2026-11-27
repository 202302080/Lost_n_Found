import React, { useState, forwardRef } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Modal, useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import ThemedText from './ThemedText'
import PostCard, { TYPE_THEME } from './PostCard'

const GAP = 12
const MAX_CONTENT_WIDTH = 1100

// Grid of post cards: 1 column on phones, 2 on tablets, 3 on very wide screens.
// Also owns the "Contact" popup so every screen shows it the same way.
const PostList = forwardRef(({ posts, loading, emptyText, onRefresh, onDeleted, accent = '#F28C28' }, ref) => {
    const { width } = useWindowDimensions()
    const [refreshing, setRefreshing] = useState(false)
    const [contact, setContact] = useState(null)

    const columns = width >= 1100 ? 3 : width >= 640 ? 2 : 1
    const contentWidth = Math.min(width, MAX_CONTENT_WIDTH)
    const sidePadding = Math.max(GAP, (width - contentWidth) / 2 + GAP)
    const cardWidth = (width - sidePadding * 2 - GAP * (columns - 1)) / columns

    const handleRefresh = async () => {
        setRefreshing(true)
        await onRefresh?.()
        setRefreshing(false)
    }

    const contactTheme = TYPE_THEME[contact?.type] || TYPE_THEME.lost

    return (
        <>
            <FlatList
                ref={ref}
                key={`cols-${columns}`} // FlatList must remount when the column count changes
                data={posts || []}
                numColumns={columns}
                keyExtractor={item => item.id}
                columnWrapperStyle={columns > 1 ? { gap: GAP } : undefined}
                contentContainerStyle={{ paddingHorizontal: sidePadding, paddingTop: GAP, paddingBottom: 24, gap: GAP }}
                renderItem={({ item }) => (
                    <PostCard
                        item={item}
                        onDeleted={onDeleted}
                        onViewContact={setContact}
                        style={{ width: cardWidth }}
                    />
                )}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
                windowSize={5}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[accent]} tintColor={accent} />
                }
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.centerBox}>
                            <ActivityIndicator size="large" color={accent} />
                        </View>
                    ) : (
                        <View style={styles.centerBox}>
                            <Ionicons name="search-outline" size={40} color="#ccc" />
                            <ThemedText style={styles.emptyText}>{emptyText || 'No posts yet'}</ThemedText>
                        </View>
                    )
                }
            />

            {/* Contact popup */}
            <Modal transparent visible={!!contact} animationType="fade" onRequestClose={() => setContact(null)}>
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <ThemedText style={styles.modalTitle}>Contact Details</ThemedText>
                            <TouchableOpacity onPress={() => setContact(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {contact && (
                            <>
                                <View style={styles.contactItem}>
                                    <Ionicons name="call" size={20} color={contactTheme.accent} />
                                    <View style={styles.contactDetail}>
                                        <ThemedText style={styles.contactLabel}>Phone Number</ThemedText>
                                        <ThemedText style={styles.contactValue} selectable>{contact.phone || 'Not provided'}</ThemedText>
                                    </View>
                                </View>
                                <View style={styles.contactItem}>
                                    <Ionicons name="chatbubble" size={20} color={contactTheme.accent} />
                                    <View style={styles.contactDetail}>
                                        <ThemedText style={styles.contactLabel}>Messenger</ThemedText>
                                        <ThemedText style={styles.contactValue} selectable>{contact.messenger || 'Not provided'}</ThemedText>
                                    </View>
                                </View>
                            </>
                        )}

                        <TouchableOpacity style={[styles.closeButton, { backgroundColor: contactTheme.accent }]} onPress={() => setContact(null)}>
                            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
})

export default PostList

const styles = StyleSheet.create({
    centerBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 20 },
    emptyText: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 8 },
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    modal: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '85%', maxWidth: 380 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    contactDetail: { marginLeft: 15, flex: 1 },
    contactLabel: { fontSize: 12, color: '#999', marginBottom: 3 },
    contactValue: { fontSize: 15, fontWeight: '600', color: '#333' },
    closeButton: { padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 18 },
    closeButtonText: { color: '#fff', fontWeight: 'bold' },
})
