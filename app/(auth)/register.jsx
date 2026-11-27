import { Keyboard, StyleSheet, Text, View, TouchableWithoutFeedback, ScrollView, Image } from 'react-native'
import { Link, useRouter } from 'expo-router'

import Logo from '../../assets/img/logo.png'
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import PasswordInput from '../../components/PasswordInput'
import { useState } from 'react'
import { API_URL } from '../../lib/api'
import { Alert } from 'react-native'



const Register = () => {
    const router = useRouter()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
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


                    {/* Register Form Title */}
                    <ThemedText title={true} style={styles.formTitle}>
                        Create Your Account
                    </ThemedText>

                    

                    {/* Form Inputs */}
                    {/* First and last name side by side */}
                    <View style={styles.nameRow}>
                        <ThemedTextInput
                            style={[styles.input, styles.nameInput]}
                            placeholder="First Name"
                            placeholderTextColor="#999"
                            onChangeText={setFirstName}
                            value={firstName}
                        />

                        <ThemedTextInput
                            style={[styles.input, styles.nameInput]}
                            placeholder="Last Name"
                            placeholderTextColor="#999"
                            onChangeText={setLastName}
                            value={lastName}
                        />
                    </View>

                    <ThemedTextInput
                        style={styles.input}
                        placeholder="CVSU Email"
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

                    <PasswordInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#999"
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                    />

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
                    </View>

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
        marginBottom: 14,
        borderRadius: 10,
        paddingVertical: 12,
    },
    nameRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    nameInput: {
        flex: 1,
        width: undefined,
        minWidth: 0,
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
    loginText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 12,
    },
    loginLink: {
        color: '#008000',
        fontWeight: '700',
        fontSize: 14,
    },
})