import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { Link } from 'expo-router'

import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import { useState } from 'react'
import { API_URL } from '../../lib/api'
import { Alert } from 'react-native'



const Register = () => {
     const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')

    const handleSubmit = async () => {
         try {
            const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
            Alert.alert('Error', data.message)
            } else {
            Alert.alert('Success', 'Account created')
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
            Register Your Account</ThemedText>

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

        <ThemedButton onPress={handleSubmit}>
            <Text style= {{ color: '#f2f2f2'}}>Register</Text>
        </ThemedButton>

        <Spacer height={250} />
            <ThemedText style={{ textAlign: 'center'}}>
            Sign up instead? <Link href='/login' style={styles.link}>Login </Link>
            </ThemedText>


        </ThemedView>
        </TouchableWithoutFeedback>
  )
}

export default Register

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 20,
    }
})