import { Keyboard, StyleSheet, Text, View, Image, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { useRouter, Link } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

import Logo from '../../assets/img/logo.png'
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import PasswordInput from '../../components/PasswordInput'
import { useUser } from '../../hooks/useUser'


const Login = () => {
    const router = useRouter()
    const { login } = useUser()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
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
                // Redirect to feed after successful login
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
                    {/* Card: logo, title, tagline, form fields and button */}
                    <View style={styles.card}>

                    {/* Logo Section */}
                    <Image source={Logo} style={styles.logo} />

                    {/* Title Section */}
                    <ThemedText title={true} style={styles.mainTitle}>
                        Found IT!
                    </ThemedText>
                    
                    <ThemedText style={styles.subtitle}>
                        Find what's lost, return what's found
                    </ThemedText>

                    {/* Form Inputs */}
                    <ThemedTextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        value={email}
                    />

                    <PasswordInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        onChangeText={setPassword}
                        value={password}
                    />

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
                    </View>

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
    // Logo, title, tagline, fields and button sit in a card: full width on phones, 440 wide on tablets
    card: {
        width: '100%',
        maxWidth: 440,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 24,
        alignItems: 'center',
        marginBottom: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
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
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        opacity: 0.7,
        fontStyle: 'italic',
    },
    formTitle: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 25,
        letterSpacing: 0.3,
    },
    input: {
        width: '100%',
        backgroundColor: '#f4f4f7',
        borderWidth: 1,
        borderColor: '#e2e2e8',
        color: '#222',
        marginBottom: 16,
        borderRadius: 10,
        paddingVertical: 12,
    },
    button: {
        width: '100%',
        maxWidth: 440,
        marginTop: 8,
        borderRadius: 10,
    },
    buttonText: {
        color: '#f2f2f2',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    signupText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 12,
    },
    signupLink: {
        color: '#008000',
        fontWeight: '700',
        fontSize: 14,
    },
})