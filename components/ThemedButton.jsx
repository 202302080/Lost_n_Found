import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { colors } from '../constants/colors'

function ThemedButton ({ style, title, children, textStyle, ...props}) {
  const renderChild = (child, idx) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <Text key={idx} style={[styles.text, textStyle]}>{child}</Text>
    }
    return child
  }

  let content = null
  if (children != null) {
    content = React.Children.count(children) > 1
      ? React.Children.map(children, renderChild)
      : renderChild(children)
  } else if (title) {
    content = <Text style={[styles.text, textStyle]}>{title}</Text>
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}
      {...props}
    >
      {content}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5
  },
  text: {
    color: '#fff',
    fontWeight: '700',
  }
})

export default ThemedButton