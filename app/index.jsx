import { StyleSheet, Text, View, Image } from 'react-native'
import { Link } from 'expo-router'

import Logo from '../assets/img/logo.png'
import ThemedView from '../components/ThemedView'
import Spacer from '../components/Spacer'
import ThemedText from '../components/ThemedText'

const Home = () => {
  return (
    <ThemedView style={styles.container}>
    <Spacer height={20}/>

      <Image source={Logo} style={styles.img}></Image>

      <ThemedText style={styles.title} title={true}>
        TEST
        </ThemedText>

      <Spacer height= {10}/>
      <ThemedText>Landing Section</ThemedText>
      <Spacer/>

      <Link href="/login">
      <ThemedText>Login</ThemedText></Link>

      <Link href="/register">
      <ThemedText>Register</ThemedText></Link>

      <Link href="/profile">
      <ThemedText>Profile</ThemedText></Link>

    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24
  },
  img: {
    marginVertical: 20
  }

})
