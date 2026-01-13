import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, ScrollView, Image, View, TouchableOpacity, Alert } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

import Logo from '../../assets/img/logo.png'
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import { API_URL } from '../../lib/api'

const Register = () => {
    const router = useRouter()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        try {
            setLoading(true)
            
            // Basic validation
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                Alert.alert('Error', 'Please fill in all fields')
                setLoading(false)
                return
            }

            if (password !== confirmPassword) {
                Alert.alert('Error', 'Passwords do not match')
                setLoading(false)
                return
            }

            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    firstName, 
                    lastName, 
                    email, 
                    password, 
                    confirmPassword 
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                Alert.alert('Error', data.message)
            } else {
                Alert.alert(
                    'Success', 
                    'Account created successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Reset form
                                setFirstName('')
                                setLastName('')
                                setEmail('')
                                setPassword('')
                                setConfirmPassword('')
                                // Navigate to login
                                router.replace('/login')
                            }
                        }
                    ]
                )
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

                    {/* Register Form Title */}
                    <ThemedText title={true} style={styles.formTitle}>
                        Create Your Account
                    </ThemedText>

                    {/* Form Inputs */}
                    <ThemedTextInput
                        style={styles.input}
                        placeholder="First Name"
                        placeholderTextColor="#999"
                        onChangeText={setFirstName}
                        value={firstName}
                    />

                    <ThemedTextInput
                        style={styles.input}
                        placeholder="Last Name"
                        placeholderTextColor="#999"
                        onChangeText={setLastName}
                        value={lastName}
                    />

                    <ThemedTextInput
                        style={styles.input}
                        placeholder="CVSU Email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        value={email}
                    />

                    {/* Password Input */}
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

                    {/* Confirm Password Input */}
                    <View style={styles.passwordContainer}>
                        <ThemedTextInput
                            style={styles.passwordInput}
                            placeholder="Confirm Password"
                            placeholderTextColor="#999"
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity 
                            style={styles.eyeIcon} 
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Ionicons 
                                name={showConfirmPassword ? "eye-off" : "eye"} 
                                size={24} 
                                color="#666" 
                            />
                        </TouchableOpacity>
                    </View>

                    <Spacer height={15} />

                    {/* Register Button */}
                    <ThemedButton
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Creating Account...' : 'Register'}
                        </Text>
                    </ThemedButton>

                    <Spacer height={15} />

                    {/* Login Link */}
                    <ThemedText style={styles.loginText}>
                        Already have an account?{' '}
                        <Link href='/login' style={styles.loginLink}>
                            Login
                        </Link>
                    </ThemedText>

                </ThemedView>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

export default Register

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
    formTitle: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 25,
        letterSpacing: 0.3,
        color: '#333'
    },
    input: {
        width: '100%',
        marginBottom: 14,
        borderRadius: 10,
        paddingVertical: 12,
        backgroundColor: '#f5f5f5', 
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#eee'
    },
    passwordContainer: {
        width: '100%',
        marginBottom: 14,
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
        marginTop: 8,
        borderRadius: 25,
        backgroundColor: '#008000', // Green Theme
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
    loginText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 20,
        color: '#666'
    },
    loginLink: {
        color: '#008000', // Green Theme
        fontWeight: '700',
        fontSize: 14,
    },
})