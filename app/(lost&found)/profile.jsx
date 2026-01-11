import { StyleSheet, Image, View, Alert, TouchableOpacity } from 'react-native'

import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'

const Profile = () => {
    const [tab, setTab] = React.useState('lost')

    const onEdit = () => {
        Alert.alert('Edit', 'Edit profile tapped')
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.topCenter}>
                <Image
                    source={{ uri: 'https://placehold.co/120x120/ffffff/000000?text=U' }}
                    style={styles.avatar}
                />
                <ThemedText title={true} style={styles.username}>Username</ThemedText>
            </View>

            <View style={styles.tabRow}>
                <TouchableOpacity style={styles.tabWrap} onPress={() => setTab('lost')}>
                    <ThemedText style={[styles.tabText, tab === 'lost' && styles.tabActiveLost]}>Lost</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabWrap} onPress={() => setTab('found')}>
                    <ThemedText style={[styles.tabText, tab === 'found' && styles.tabActiveFound]}>Found</ThemedText>
                </TouchableOpacity>
            </View>

            <ThemedCard style={styles.contentCard}>
                {tab === 'lost' ? (
                    <ThemedText style={styles.emptyText}>No lost item yet so far.</ThemedText>
                ) : (
                    <ThemedText style={styles.emptyText}>No found item yet so far.</ThemedText>
                )}
            </ThemedCard>

            <Spacer />

            <ThemedButton onPress={onEdit} title="Edit Profile" />
        </ThemedView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    card: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 12,
    },
    meta: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
    },
    email: {
        color: '#666',
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 16,
        fontWeight: '700',
    },
    statLabel: {
        color: '#666',
        marginTop: 4,
    },
})
