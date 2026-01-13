import { View, StyleSheet } from 'react-native'
import ThemedText from './ThemedText'

const UserAvatar = ({ firstName, lastName, size = 40 }) => {
  const initials =
    `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <ThemedText style={[styles.text, { fontSize: size / 2 }]}>
        {initials}
      </ThemedText>
    </View>
  )
}

export default UserAvatar

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#008000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
