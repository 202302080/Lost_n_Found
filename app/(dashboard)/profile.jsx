import { StyleSheet, Image, View } from 'react-native'

import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import { useUser } from '../../hooks/useUser' 

const Profile = () => {
  const { user } = useUser()
  
  // --- CHANGED: Now uses the user's name to generate initials ---
  const userNameForAvatar = user ? `${user.firstName}+${user.lastName}` : 'User';
  const DEFAULT_AVATAR = `https://ui-avatars.com/api/?name=${userNameForAvatar}&background=random&color=fff`;
  // -------------------------------------------------------------

  return (
    <ThemedView style={styles.container}>
        <ThemedText title={true} style={styles.heading}>
            
        </ThemedText>
        
        <Spacer />

        <View style={styles.profileSection}>
            <Image 
                source={{ uri: user?.profilePicture || DEFAULT_AVATAR }} 
                style={styles.avatarImage} 
            />

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
    profileSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#28A745', 
        marginBottom: 15,
        backgroundColor: '#DDD'
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