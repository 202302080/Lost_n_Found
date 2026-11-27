import React, { useState, useCallback, useRef, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import axios from 'axios'

import ThemedView from './ThemedView'
import FeedHeader from './FeedHeader'
import PostList from './PostList'
import { TYPE_THEME, formatPost } from './PostCard'
import { API_URL } from '../lib/api'

// Lost and Found share one screen: both lists load once and the LOST / FOUND
// tabs switch between them in place; the bottom Home tab goes back to the feed.
const LostFoundFeed = ({ initialType = 'lost' }) => {
    // Home's LOST / FOUND tabs open this screen with ?type=lost|found
    const router = useRouter()
    const { type: typeParam } = useLocalSearchParams()
    const [type, setType] = useState(typeParam === 'found' || typeParam === 'lost' ? typeParam : initialType)
    const [postsByType, setPostsByType] = useState({ lost: null, found: null }) // null = not loaded yet
    const [errorByType, setErrorByType] = useState({ lost: null, found: null })
    const listRef = useRef(null)

    // The tab screen stays mounted, so follow later changes to ?type too
    useEffect(() => {
        if (typeParam === 'found' || typeParam === 'lost') setType(typeParam)
    }, [typeParam])

    const fetchType = useCallback(async (t) => {
        try {
            const response = await axios.get(`${API_URL}/posts/type/${t}`, { timeout: 20000 })
            setPostsByType(prev => ({ ...prev, [t]: (response.data.posts || []).map(formatPost) }))
            setErrorByType(prev => ({ ...prev, [t]: null }))
        } catch (error) {
            console.error(`Error fetching ${t} items:`, error.message)
            setErrorByType(prev => ({ ...prev, [t]: 'Could not load posts. Pull down to try again.' }))
            setPostsByType(prev => ({ ...prev, [t]: prev[t] || [] }))
        }
    }, [])

    // Load both lists when the screen opens or regains focus, so switching is instant
    useFocusEffect(
        useCallback(() => {
            fetchType('lost')
            fetchType('found')
        }, [fetchType])
    )

    const onSelect = (key) => {
        if (key === type) return
        setType(key)
        router.setParams({ type: key }) // keep ?type in sync so Home's tabs always switch it
        listRef.current?.scrollToOffset({ offset: 0, animated: false })
    }

    const posts = postsByType[type]

    return (
        <ThemedView style={styles.container}>
            <FeedHeader active={type} onSelect={onSelect} />
            <PostList
                ref={listRef}
                posts={posts}
                loading={posts === null}
                emptyText={errorByType[type] || `No ${type} items yet`}
                onRefresh={() => fetchType(type)}
                onDeleted={() => fetchType(type)}
                accent={TYPE_THEME[type].accent}
            />
        </ThemedView>
    )
}

export default LostFoundFeed

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f6' },
})
