import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import ThemedText from './ThemedText';
import { API_URL } from '../lib/api';

// Added onMarkFound to props
const PostOptionsMenu = ({ postId, onPostDeleted, onMarkFound }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const buttonRef = useRef(null);

    const handleDeletePost = async () => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
            [
                {
                    text: 'Cancel',
                    onPress: () => setMenuVisible(false),
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_URL}/posts/${postId}`);
                            setMenuVisible(false);
                            if (onPostDeleted) {
                                onPostDeleted();
                            }
                            Alert.alert('Success', 'Post deleted successfully');
                        } catch (error) {
                            console.error('Error deleting post:', error);
                            Alert.alert('Error', 'Failed to delete post');
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const handleMarkAsFound = () => {
        setMenuVisible(false);
        if (onMarkFound) {
            onMarkFound();
        }
    };

    const handleMenuOpen = () => {
        if (buttonRef.current) {
            buttonRef.current.measure((fx, fy, width, height, px, py) => {
                setMenuPosition({
                    top: py + height + 5,
                    right: 20,
                });
                setMenuVisible(true);
            });
        }
    };

    return (
        <View>
            <TouchableOpacity 
                ref={buttonRef}
                onPress={handleMenuOpen}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="ellipsis-horizontal" size={20} color="black" />
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={menuVisible}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setMenuVisible(false)}
                    activeOpacity={1}
                >
                    <View style={[styles.menuContainer, { top: menuPosition.top, right: menuPosition.right }]}>
                        
                        {/* Only show Mark as Found if the function is passed (e.g. for Lost items) */}
                        {onMarkFound && (
                            <>
                                <TouchableOpacity 
                                    style={styles.menuItem}
                                    onPress={handleMarkAsFound}
                                >
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#32CD32" style={styles.menuIcon} />
                                    <ThemedText style={styles.menuText}>Mark as Found</ThemedText>
                                </TouchableOpacity>

                                <View style={styles.divider} />
                            </>
                        )}

                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={handleDeletePost}
                        >
                            <Ionicons name="trash-outline" size={20} color="#FF4444" style={styles.menuIcon} />
                            <ThemedText style={[styles.menuText, { color: '#FF4444' }]}>Delete Post</ThemedText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default PostOptionsMenu;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Lighter overlay
    },
    menuContainer: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 12,
        width: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingVertical: 5
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    menuIcon: {
        marginRight: 12,
    },
    menuText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 10,
    },
});