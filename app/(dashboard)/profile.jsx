import { StyleSheet, Image, View, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router' // Import Router for redirection

import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import { useUser } from '../../hooks/useUser' 

const Profile = () => {
  const { user, setUser } = useUser() // Assuming your hook might have a setUser to clear it, otherwise ignore setUser
  const router = useRouter()
  
  // --- Avatar Logic ---
  const userNameForAvatar = user ? `${user.firstName}+${user.lastName}` : 'User';
  const DEFAULT_AVATAR = `https://ui-avatars.com/api/?name=${userNameForAvatar}&background=random&color=fff`;
  // --------------------

  const handleLogout = () => {
    Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Log Out", 
                style: "destructive",
                onPress: async () => {
                    // 1. Clear user session here (if using Context or AsyncStorage)
                    if (setUser) setUser(null); 
                    
                    // 2. Redirect to Login Screen
                    // Change '/login' to your actual login route (e.g., '/' or '/auth/login')
                    router.replace('/login'); 
                }
            }
        ]
    );
  }

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

        {/* --- LOGOUT BUTTON --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
        </TouchableOpacity>

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
    },
    // --- Logout Styles ---
    logoutButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: '#FF3B30', // Red color for logout
        borderRadius: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    logoutText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
})