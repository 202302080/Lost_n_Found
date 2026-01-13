import { StyleSheet, Image, View } from 'react-native'

import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
// 1. Import the hook to get user data
import { useUser } from '../../hooks/useUser' 

const Profile = () => {
  // 2. Get the user object
  const { user } = useUser()

  return (
    <ThemedView style={styles.container}>
        <ThemedText title={true} style={styles.heading}>
            Profile Page
        </ThemedText>
        
        <Spacer />

        {/* 3. Avatar Section (Same logic as Modal, but bigger) */}
        <View style={styles.profileSection}>
            {user?.profilePicture ? (
                <Image 
                    source={{ uri: user.profilePicture }} 
                    style={styles.avatarImage} 
                />
            ) : (
                <View style={styles.avatarPlaceholder}>
                    <ThemedText style={styles.avatarInitial}>
                        {user?.firstName ? user.firstName.charAt(0) : '?'}
                    </ThemedText>
                </View>
            )}

            {/* User Details */}
            <ThemedText style={styles.userName}>
                {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
            </ThemedText>
            
            {user?.email && (
                <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
            )}
        </View>

        <Spacer />
    </ThemedView>
  )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    // --- Profile Specific Styles ---
    profileSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatarImage: {
        width: 120,    // Bigger than the modal
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#28A745', // Use your brand color (Found Green) or Neutral
        marginBottom: 15,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#28A745',
    },
    avatarInitial: {
        fontSize: 50, // Big text for the initial
        fontWeight: 'bold',
        color: '#FFF',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        opacity: 0.6,
        marginTop: 5,
    }
})