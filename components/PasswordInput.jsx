import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import ThemedTextInput from './ThemedTextInput'

// Password field with an eye button to show / hide what was typed.
// `style` is applied to the text field; `containerStyle` to the wrapper (e.g. margins).
const PasswordInput = ({ style, containerStyle, ...props }) => {
    const [visible, setVisible] = useState(false)

    // Move the field's bottom margin onto the wrapper so the eye stays centred on the field
    const marginBottom = StyleSheet.flatten(style)?.marginBottom

    return (
        <View style={[styles.wrap, { marginBottom }, containerStyle]}>
            <ThemedTextInput
                {...props}
                style={[style, styles.input]}
                secureTextEntry={!visible}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TouchableOpacity
                onPress={() => setVisible(v => !v)}
                style={styles.eye}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            >
                <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={22} color="#777" />
            </TouchableOpacity>
        </View>
    )
}

export default PasswordInput

const styles = StyleSheet.create({
    wrap: { width: '100%', justifyContent: 'center' },
    input: { marginBottom: 0, paddingRight: 48 }, // margin lives on the wrapper; leave room for the eye
    eye: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
})
