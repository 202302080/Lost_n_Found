import { Keyboard, StyleSheet, Text, Image, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { Link } from 'expo-router'

import Logo from '../../assets/img/logo.png'
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import { useState } from 'react'
import { API_URL } from '../../lib/api'
import { Alert } from 'react-native'


const Login = () => {
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

            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                Alert.alert('Login Failed', data.message)
            } else {
                Alert.alert('Welcome', `Hello ${data.user.firstName}!`)
            }
        } catch (err) {
            Alert.alert('Error', 'Server not reachable')
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

                    <ThemedTextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
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
        marginBottom: 35,
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
        marginBottom: 16,
        borderRadius: 10,
        paddingVertical: 12,
    },
    button: {
        width: '100%',
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
        marginTop: 25,
    },
    signupLink: {
        color: '#008000',
        fontWeight: '700',
        fontSize: 14,
    },
})