import React, { useState, useEffect } from 'react'; 
import { StyleSheet, Image, View, Alert, TouchableOpacity } from 'react-native'

import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'
import { useUser } from '../../hooks/useUser'
import { API_URL } from '../../lib/api'
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
    const [tab, setTab] = React.useState('lost')
    const [profilePic, setProfilePic] = useState(null);
    const { user } = useUser()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)

    const onEdit = () => {
        Alert.alert('Edit', 'Edit profile tapped')
    }

    const onChangeProfilePic = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow access to your photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setProfilePic(result.assets[0].uri);
        }
    };


    useEffect(() => {
        if (!user) return

        let mounted = true
        async function load() {
            try {
                setLoading(true)
                const res = await fetch(`${API_URL}/posts/user/${user.id}`)
                const data = await res.json()
                if (mounted) setPosts(data.posts || [])
            } catch (err) {
                if (mounted) setPosts([])
            } finally {
                if (mounted) setLoading(false)
            }
        }

        load()

        return () => { mounted = false }
    }, [user])

    const filteredPosts = posts.filter(p => p.type === tab)

    return (
        <ThemedView style={styles.container}>
            <View style={styles.topCenter}>
                <Image
                    source={{ uri: 'https://placehold.co/120x120/ffffff/000000?text=U' }}
                    style={styles.avatar}
                />
                <ThemedText title={true} style={styles.username}>{user ? `${user.firstName} ${user.lastName}` : 'Username'}</ThemedText>
            </View>

            <Image
                source={{ uri: profilePic || 'https://example.com/profile-pic.jpg' }}
                style={styles.profilePicture}
            />
            <ThemedButton title='Change Profile Picture' onPress={onChangeProfilePic}>Change Profile Picture</ThemedButton>

            

            <View style={styles.tabRow}>
                <TouchableOpacity style={styles.tabWrap} onPress={() => setTab('lost')}>
                    <ThemedText style={[styles.tabText, tab === 'lost' && styles.tabActiveLost]}>Lost</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabWrap} onPress={() => setTab('found')}>
                    <ThemedText style={[styles.tabText, tab === 'found' && styles.tabActiveFound]}>Found</ThemedText>
                </TouchableOpacity>
            </View>
            <View style={styles.postsContainer}>
                {loading ? (
                    <ThemedText style={styles.emptyText}>Loading...</ThemedText>
                ) : filteredPosts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>No post yet so far</ThemedText>
                    </View>
                ) : (
                    filteredPosts.map(post => (
                            <ThemedCard key={post._id || post.id} style={styles.postCard}>
                                <ThemedText title={true}>{post.item}</ThemedText>
                                <ThemedText style={{ marginTop: 6 }}>{post.description}</ThemedText>
                                <ThemedText style={{ marginTop: 6, color: '#888' }}>{post.type.toUpperCase()}</ThemedText>
                            </ThemedCard>
                        ))
                )}
            </View>

            <Spacer />

            <ThemedButton onPress={onEdit} title="Edit Profile" />
        </ThemedView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    topCenter: {
        alignItems: 'center',
    },
    username: {
        fontSize: 18,
        marginTop: 8,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 12,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 20,
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    tabWrap: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginHorizontal: 4,
    },
    tabText: {
        fontSize: 16,
    },
    tabActiveLost: {
        backgroundColor: '#e0f7fa',
        color: '#ee7f00',
    },
    tabActiveFound: {
        backgroundColor: '#f3e5f5',
        color: '#1b9a21',
    },
    postsContainer: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postCard: {
        marginBottom: 12,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
    },
})
