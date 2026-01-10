import React, { useState } from 'react';
import { 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  View, 
  TextInput,
  Image,
  Alert,
  ScrollView // Added ScrollView in case content gets too long
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ThemedText from './ThemedText'; 

// --- COLOR CONSTANTS ---
const COLORS = {
    LOST: '#F28C28', // Orange
    FOUND: '#28A745', // Green
    INACTIVE: '#999',
    BG_LIGHT: '#E5E5E5',
    BG_WHITE: '#FFF',
    TEXT_DARK: '#333',
    BORDER: '#EEE'
};

const CreatePostModal = ({ visible, onClose }) => {
  // Form State
  const [itemCategory, setItemCategory] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [postText, setPostText] = useState(''); // Description
  const [image, setImage] = useState(null);
  const [postType, setPostType] = useState('lost');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    // Basic validation
    if (!itemCategory || !contactInfo || !postText) {
      Alert.alert("Missing Fields", "Please fill in Item, Contact Info, and Description.");
      return;
    }

    const payload = {
        type: postType,
        item: itemCategory,
        contact: contactInfo,
        description: postText,
        imageUri: image,
        user: "Jame Hart",
        date: new Date().toISOString()
    };

    console.log("Submitting Post:", payload);
    
    // Reset Form
    setItemCategory('');
    setContactInfo('');
    setPostText('');
    setImage(null);
    setPostType('lost'); 
    onClose(); 
  };

  // Determine active color
  const activeColor = postType === 'lost' ? COLORS.LOST : COLORS.FOUND;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          {/* Header */}
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Create Post</ThemedText>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.INACTIVE} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.separator} />

          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={[styles.avatarPlaceholder, { borderColor: activeColor }]} /> 
            <View>
              <ThemedText style={styles.userName}>Jame Hart</ThemedText>
              <ThemedText style={styles.userRole}>Public</ThemedText>
            </View>
          </View>

          {/* --- LOST / FOUND TOGGLE --- */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
                style={[styles.toggleBtn, postType === 'lost' && styles.lostActive]} 
                onPress={() => setPostType('lost')}
            >
                <ThemedText style={[styles.toggleText, postType === 'lost' && styles.activeText]}>LOST</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.toggleBtn, postType === 'found' && styles.foundActive]} 
                onPress={() => setPostType('found')}
            >
                <ThemedText style={[styles.toggleText, postType === 'found' && styles.activeText]}>FOUND</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Main Form Container */}
          <View style={styles.formContainer}>
            
            {/* 1. Item Input */}
            <View style={styles.inputRow}>
                <Ionicons name="pricetag-outline" size={20} color={COLORS.INACTIVE} style={styles.inputIcon} />
                <TextInput
                    style={styles.singleLineInput}
                    placeholder="Item (e.g. Wallet, Keys, Dog)"
                    placeholderTextColor={COLORS.INACTIVE}
                    value={itemCategory}
                    onChangeText={setItemCategory}
                />
            </View>
            <View style={styles.inputSeparator} />

            {/* 2. Contact Info Input */}
            <View style={styles.inputRow}>
                <Ionicons name="call-outline" size={20} color={COLORS.INACTIVE} style={styles.inputIcon} />
                <TextInput
                    style={styles.singleLineInput}
                    placeholder="Contact Info (Phone, Email, Location)"
                    placeholderTextColor={COLORS.INACTIVE}
                    value={contactInfo}
                    onChangeText={setContactInfo}
                />
            </View>
            <View style={styles.inputSeparator} />

            {/* 3. Description Input */}
            <TextInput
              style={styles.multiLineInput}
              placeholder={`Describe the ${itemCategory || 'item'} you ${postType}...`}
              placeholderTextColor={COLORS.INACTIVE}
              multiline
              value={postText}
              onChangeText={setPostText}
            />

            {/* Image Preview */}
            {image && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity 
                        style={styles.removeImageBtn} 
                        onPress={() => setImage(null)}
                    >
                        <Ionicons name="close-circle" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            )}
            
            {/* Action Icons (Image Picker) */}
            <View style={styles.iconRow}>
                <TouchableOpacity><Ionicons name="mic-outline" size={24} color={COLORS.INACTIVE} style={styles.icon} /></TouchableOpacity>
                <TouchableOpacity><Ionicons name="happy-outline" size={24} color={COLORS.INACTIVE} style={styles.icon} /></TouchableOpacity>
                
                {/* Image Picker Trigger */}
                <TouchableOpacity onPress={pickImage}>
                    <Ionicons name="image-outline" size={24} color={activeColor} style={styles.icon} />
                </TouchableOpacity>
            </View>
          </View>

          {/* Post Button */}
          <TouchableOpacity 
            style={[styles.postButton, { backgroundColor: activeColor }]} 
            onPress={handlePost}
          >
            <ThemedText style={styles.postButtonText}>POST</ThemedText>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default CreatePostModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.BG_LIGHT,
    width: '100%',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  modalTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.TEXT_DARK,
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCC',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.TEXT_DARK,
    marginRight: 10,
    borderWidth: 2,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  userRole: {
    fontSize: 12,
    color: '#555',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  
  // --- Toggle Styles ---
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.BG_WHITE,
    borderRadius: 8,
    marginBottom: 15,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  lostActive: {
    backgroundColor: COLORS.LOST,
  },
  foundActive: {
    backgroundColor: COLORS.FOUND,
  },
  toggleText: {
    fontWeight: 'bold',
    color: COLORS.INACTIVE,
    fontSize: 12,
    letterSpacing: 1,
  },
  activeText: {
    color: COLORS.BG_WHITE,
  },

  // --- Form Container (The White Box) ---
  formContainer: {
    backgroundColor: COLORS.BG_WHITE,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  
  // Specific Input Styles
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  singleLineInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  inputSeparator: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    width: '100%',
  },
  multiLineInput: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
    marginBottom: 10,
    minHeight: 60, // Give description some initial height
    textAlignVertical: 'top'
  },
  
  // Image Preview
  imagePreviewContainer: {
    marginBottom: 10,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.BG_WHITE,
    borderRadius: 12,
  },

  // Bottom Icons
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    paddingTop: 8,
  },
  icon: {
    marginLeft: 15,
  },

  // Main Action Button
  postButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: COLORS.BG_WHITE,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});