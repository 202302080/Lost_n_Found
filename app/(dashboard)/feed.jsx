import React, { useState, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import axios from 'axios'

import ThemedView from '../../components/ThemedView'
import FeedHeader from '../../components/FeedHeader'
import PostList from '../../components/PostList'
import { formatPost } from '../../components/PostCard'
import { API_URL } from '../../lib/api'

// Home feed: every post. LOST / FOUND open the Lost & Found screens.
const Home = () => {
    const router = useRouter()
    const [posts, setPosts] = useState(null) // null = not loaded yet
    const [error, setError] = useState(null)

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/posts/all`, { timeout: 20000 })
            setPosts((response.data.posts || []).map(formatPost))
            setError(null)
        } catch (err) {
            console.error('Error fetching posts:', err.message)
            setError('Could not load posts. Pull down to try again.')
            setPosts(prev => prev || [])
        }
    }, [])

    // Runs when the screen first opens and every time it regains focus
    useFocusEffect(
        useCallback(() => {
            fetchPosts()
        }, [fetchPosts])
    )

    return (
        <ThemedView style={styles.container}>
            {/* Both tabs open the same Lost & Found screen; `type` says which list to show.
                (Navigating to the hidden "found" tab directly opened Lost instead.) */}
            <FeedHeader onSelect={(t) => router.push({ pathname: '/(lost&found)/lost', params: { type: t } })} />
            <PostList
                posts={posts}
                loading={posts === null}
                emptyText={error || 'No posts yet'}
                onRefresh={fetchPosts}
                onDeleted={fetchPosts}
            />
        </ThemedView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f6' },
})
