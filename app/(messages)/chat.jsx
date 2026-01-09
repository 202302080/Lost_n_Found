import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';

const MOCK_MESSAGES = [
    { id: '1', text: 'This is the main chat template', sender: 'me' },
    { id: '2', text: 'Oh?', sender: 'them' },
    { id: '3', text: 'Cool', sender: 'them' },
    { id: '4', text: 'How does it work?', sender: 'them' },
    { id: '5', text: 'I will be there in a bit.', sender: 'me' },
    { id: '6', text: 'Later!', sender: 'me' },
    { id: '7', text: 'Hmmm', sender: 'them' },
];

const ChatScreen = () => {
    const router = useRouter();
    const { userName, userAvatar } = useLocalSearchParams();
    const [message, setMessage] = useState('');

    const renderMessage = ({ item, index }) => {
        const isMe = item.sender === 'me';
        const showAvatar = !isMe && (index === MOCK_MESSAGES.length - 1 || MOCK_MESSAGES[index + 1]?.sender === 'me');

        return (
            <View style={[styles.messageRow, isMe ? styles.myRow : styles.theirRow]}>
                {!isMe && (
                    <View style={styles.avatarPlaceholder}>
                        {showAvatar && <Image source={{ uri: userAvatar }} style={styles.chatAvatar} />}
                    </View>
                )}
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                    <ThemedText style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>
                        {item.text}
                    </ThemedText>
                </View>
            </View>
        );
    };

    return (
        <ThemedView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="black" />
                </TouchableOpacity>
                <Image source={{ uri: userAvatar }} style={styles.headerAvatar} />
                <View style={styles.headerInfo}>
                    <ThemedText style={styles.headerName}>{userName}</ThemedText>
                    <ThemedText style={styles.headerStatus}>Active now</ThemedText>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="call-outline" size={22} color="black" /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="videocam-outline" size={24} color="black" /></TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={MOCK_MESSAGES}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Message..." 
                        value={message}
                        onChangeText={setMessage}
                    />
                    <View style={styles.inputIcons}>
                        <TouchableOpacity><Ionicons name="mic-outline" size={24} color="#888" /></TouchableOpacity>
                        <TouchableOpacity><Ionicons name="happy-outline" size={24} color="#888" style={{ marginHorizontal: 8 }} /></TouchableOpacity>
                        <TouchableOpacity><Ionicons name="image-outline" size={24} color="#888" /></TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ThemedView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEE',
    },
    headerAvatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 10 },
    headerInfo: { flex: 1, marginLeft: 10 },
    headerName: { fontWeight: 'bold', fontSize: 16 },
    headerStatus: { fontSize: 12, color: '#888' },
    headerIcons: { flexDirection: 'row' },
    iconBtn: { marginLeft: 15 },
    listContent: { padding: 15 },
    messageRow: { flexDirection: 'row', marginBottom: 5, alignItems: 'flex-end' },
    myRow: { justifyContent: 'flex-end' },
    theirRow: { justifyContent: 'flex-start' },
    avatarPlaceholder: { width: 30, marginRight: 8 },
    chatAvatar: { width: 28, height: 28, borderRadius: 14 },
    bubble: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, maxWidth: '75%' },
    myBubble: { backgroundColor: '#FF8C00', borderBottomRightRadius: 4 },
    theirBubble: { backgroundColor: '#E9E9EB', borderBottomLeftRadius: 4 },
    messageText: { fontSize: 15 },
    myText: { color: '#fff' },
    theirText: { color: '#000' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    input: { flex: 1, height: 40, paddingHorizontal: 15 },
    inputIcons: { flexDirection: 'row', alignItems: 'center' }
});