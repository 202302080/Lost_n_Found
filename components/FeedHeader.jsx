import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ThemedText from './ThemedText'
import { TYPE_THEME } from './PostCard'

const TABS = ['lost', 'found']

// LOST / FOUND tab bar at the top of the Home and Lost/Found screens.
// `active` is the selected tab ('lost' | 'found'), or null on Home where neither is selected.
// Padded below the status bar so the tabs never sit under system UI.
const FeedHeader = ({ active = null, onSelect }) => {
    const insets = useSafeAreaInsets()

    return (
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            {TABS.map(t => {
                const selected = t === active
                const accent = TYPE_THEME[t].accent
                return (
                    <TouchableOpacity
                        key={t}
                        onPress={() => onSelect(t)}
                        style={[styles.tab, selected && { borderBottomColor: accent }]}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        accessibilityRole="tab"
                        accessibilityState={{ selected }}
                    >
                        <ThemedText style={[styles.tabText, { color: selected ? accent : '#555' }]}>
                            {TYPE_THEME[t].label}
                        </ThemedText>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export default FeedHeader

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 24,
        backgroundColor: '#C4C4C4',
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        minWidth: 110,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabText: { fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
})
