import { Keyboard, StyleSheet, Pressable, Text, Image, TouchableWithoutFeedback } from 'react-native'
import { Link } from 'expo-router'
import { colors } from '../../constants/colors'  

import Logo from '../../assets/img/logo.png'
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import { useState } from 'react'
import { useUser } from '../../hooks/useUser'
import { API_URL } from '../../lib/api'
import { Alert } from 'react-native'


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleLogin = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
            Alert.alert('Login Failed', data.message)
            } else {
            // save token if needed
            Alert.alert('Welcome', data.user.email)
            }
        } catch (err) {
            Alert.alert('Error', 'Server not reachable')
        }
        }



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ThemedView style={[styles.container]}>

        <Spacer />
        <ThemedText title={true} style={styles.title}>
            LostnFound</ThemedText>

        <Spacer height={100} />

            <ThemedText title={true} style={styles.title}>
            Create an account</ThemedText>

        <Spacer height={10} />

            <ThemedTextInput 
                style={{ width: '80%', marginBottom: 20}}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email} 

                />

            <ThemedTextInput
            style={{ width: '80%', marginBottom: 20}}
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry

                />

            <ThemedButton onPress={handleLogin}>
            <Text style= {{ color: '#f2f2f2'}}>Login</Text>
        </ThemedButton>

            <Spacer height={100} />

            <ThemedText style={{ textAlign: 'center'}}>
                Don't have an account yet? <Link href='/register'>Sign up </Link>
            </ThemedText>


        </ThemedView>
        </TouchableWithoutFeedback>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 1,
    },
    btn: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 5,
    },
    pressed: {
        opacity: 0.8
    
    },
    img: {

    }
})