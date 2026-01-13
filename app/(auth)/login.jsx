import { Keyboard, StyleSheet, Text, Image, TouchableWithoutFeedback, ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import { useRouter, Link } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

import Logo from '../../assets/img/logo.png'
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import { useUser } from '../../hooks/useUser'

const Login = () => {
    const router = useRouter()
    const { login } = useUser()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setLoading(true)
            
            if (!email || !password) {
                Alert.alert('Error', 'Please fill in all fields')
                setLoading(false)
                return
            }

            const success = await login(email, password)
            
            if (success) {
                Alert.alert('Welcome', 'Login successful!')
                router.replace('/(dashboard)/feed')
            }
        } catch (err) {
            Alert.alert('Error', 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <ThemedView style={styles.container}>
                    {/* Logo Section */}
                    <Image source={Logo} style={styles.logo} />

                    {/* Title Section */}
                    <ThemedText title={true} style={styles.mainTitle}>
                        Found IT!
                    </ThemedText>
                    
                    <ThemedText style={styles.subtitle}>
                        Find what's lost, return what's found
                    </ThemedText>

                    <Spacer height={30} />

                    {/* Email Input */}
                    <ThemedTextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        value={email}
                    />

                    {/* Password Input with Toggle */}
                    <View style={styles.passwordContainer}>
                        <ThemedTextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity 
                            style={styles.eyeIcon} 
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons 
                                name={showPassword ? "eye-off" : "eye"} 
                                size={24} 
                                color="#666" 
                            />
                        </TouchableOpacity>
                    </View>

                    <Spacer height={10} />

                    {/* Login Button */}
                    <ThemedButton 
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Text>
                    </ThemedButton>

                    <Spacer height={20} />

                    {/* Sign Up Link */}
                    <ThemedText style={styles.signupText}>
                        Don't have an account?{' '}
                        <Link href='/register' style={styles.signupLink}>
                            Sign up
                        </Link>
                    </ThemedText>

                </ThemedView>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

export default Login

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 25,
        resizeMode: 'contain',
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
        color: '#333'
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 35,
        opacity: 0.7,
        fontStyle: 'italic',
        color: '#666'
    },
    input: {
        width: '100%',
        marginBottom: 16,
        borderRadius: 10,
        paddingVertical: 12,
        backgroundColor: '#f5f5f5', 
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#eee'
    },
    passwordContainer: {
        width: '100%',
        marginBottom: 16,
        position: 'relative',
        justifyContent: 'center',
    },
    passwordInput: {
        width: '100%',
        borderRadius: 10,
        paddingVertical: 12,
        paddingLeft: 15,
        paddingRight: 50, 
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#eee'
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        height: '100%',
        justifyContent: 'center',
    },
    button: {
        width: '100%',
        marginTop: 10,
        borderRadius: 25, 
        backgroundColor: '#008000', // Green
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    signupText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 25,
        color: '#666'
    },
    signupLink: {
        color: '#008000', // Green to match button
        fontWeight: '700',
        fontSize: 14,
    },
})