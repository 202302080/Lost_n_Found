import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import ThemedText from './ThemedText';
import { API_URL } from '../lib/api';

const MENU_WIDTH = 180;
const MENU_HEIGHT = 100; // two rows + divider, used to decide whether to open upwards

const PostOptionsMenu = ({ postId, onPostDeleted }) => {
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

    const handleMarkPost = () => {
        Alert.alert('Mark Post', 'This feature is coming soon!');
        setMenuVisible(false);
    };

    // Open the menu right under the three-dot button, right edges aligned.
    // (It used to sit a fixed 20pt from the screen edge, so on a two-column
    // layout the left card's menu appeared over the right card.)
    const handleMenuOpen = () => {
        if (buttonRef.current) {
            buttonRef.current.measure((fx, fy, width, height, px, py) => {
                const { width: screenW, height: screenH } = Dimensions.get('window');
                const EDGE = 8;

                // right offset that lines the menu's right edge up with the button's,
                // kept inside the screen on both sides
                let right = screenW - (px + width);
                right = Math.min(Math.max(right, EDGE), screenW - MENU_WIDTH - EDGE);

                // below the button, or above it if there's no room at the bottom
                let top = py + height + 6;
                if (top + MENU_HEIGHT > screenH - EDGE) top = Math.max(EDGE, py - MENU_HEIGHT - 6);

                setMenuPosition({ top, right });
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
                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={handleMarkPost}
                        >
                            <Ionicons name="flag" size={18} color="#FF8C00" style={styles.menuIcon} />
                            <ThemedText style={styles.menuText}>Mark Post</ThemedText>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={handleDeletePost}
                        >
                            <Ionicons name="trash" size={18} color="#FF4444" style={styles.menuIcon} />
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menuContainer: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 12,
        width: MENU_WIDTH,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        backgroundColor: '#eee',
    },
});
