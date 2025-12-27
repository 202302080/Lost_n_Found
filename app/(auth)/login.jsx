import { StyleSheet, Pressable, Text, Image } from 'react-native'
import { Link } from 'expo-router'
import { colors } from '../../constants/colors'  

import Logo from '../../assets/img/logo.png'
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
        <Image source={Logo} style={styles.img}></Image>
        <ThemedText title={true} style={styles.title}>
            You Found Me!</ThemedText>

        <Spacer height={100} />

            <ThemedText title={true} style={styles.title}>
            Create an account</ThemedText>

            <ThemedButton onPress={handleSubmit}>
            <Text style= {{ color: '#f2f2f2'}}>Login</Text>
        </ThemedButton>

            <Spacer height={100} />

            <ThemedText style={{ textAlign: 'center'}}>
                Don't have an account yet? <Link href='/register'>Sign up </Link>
            </ThemedText>


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
    
    },
    img: {

    }
})