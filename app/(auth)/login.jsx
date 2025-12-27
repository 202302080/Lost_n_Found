import { StyleSheet, Pressable, Text } from 'react-native'
import { Link } from 'expo-router'
import { colors } from '../../constants/colors'  


import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'

const Login = () => {

    const handleSubmit = () => {
        console.log('Login pressed')
    }

  return (
    <ThemedView style={[styles.container]}>

        <Spacer />
        <ThemedText title={true} style={styles.title}>
            LostnFound</ThemedText>

        <Spacer height={100} />

            <ThemedText title={true} style={styles.title}>
            Create an account</ThemedText>

            <ThemedText style={{ textAlign: 'center'}}>
                Enter your username to sign up.
            </ThemedText>

            <ThemedButton onPress={handleSubmit}>
            <Text style= {{ color: '#f2f2f2'}}>Login</Text>
        </ThemedButton>

            <Spacer height={250} />

            <ThemedText style={{ textAlign: 'center'}}>
                Don't have an account yet? <Link href='/register'>Sign up </Link>
            </ThemedText>

            <Link href="/">
            <ThemedText>Back Home</ThemedText>
            </Link>


        </ThemedView>
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
    
    }
})