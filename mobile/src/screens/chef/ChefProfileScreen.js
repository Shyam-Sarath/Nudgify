import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, Pressable, Alert, ScrollView, Image, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { MessageCircle, Shield } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../config/api';
import { useAuthStore } from '../../store/store';
import { useTheme } from '../../theme';
import { Card, Button, Input, Divider } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChefProfileScreen({ navigation }) {
  const { user, logout } = useAuthStore();
  const { colors, spacing, radius, typography } = useTheme();

  const [bio, setBio] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/chef/profile');
      const profile = res.data.data;
      setBio(profile.bio || '');
      setCuisineType(profile.cuisine_type || '');
      setProfileImage(profile.profile_image || null);
    } catch (error) {
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await apiClient.put('/api/chef/profile', { bio, cuisine_type: cuisineType });
      Alert.alert('✅ Saved', 'Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile details');
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission needed', 'You need to grant camera roll permissions to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      uploadImage(result.assets[0].base64);
    }
  };

  const uploadImage = async (base64String) => {
    setUploading(true);
    try {
      const payload = { imageBase64: `data:image/jpeg;base64,${base64String}` };
      const res = await apiClient.post('/api/chef/profile/image', payload);
      setProfileImage(res.data.data.profile_image);
      Alert.alert('✅ Updated', 'Profile photo updated!');
    } catch (error) {
      Alert.alert('Failed', error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    // In a real app we might delete it from storage, but for now we'll just clear the DB field
    // by triggering an update without it, or we simply set it to null. We'll set to null.
    setUploading(true);
    try {
      await apiClient.put('/api/chef/profile', { bio, cuisine_type: cuisineType, profile_image: null });
      setProfileImage(null);
      Alert.alert('Removed', 'Profile photo removed.');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove photo.');
    } finally {
      setUploading(false);
    }
  };

  const initials = (user?.name || 'C')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Header */}
        <View style={[styles.heroHeader, { backgroundColor: colors.primary }]}>
          <Pressable onPress={handlePickImage} disabled={uploading}>
            {uploading ? (
              <View style={[styles.avatarFallback, { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.full }]}>
                <ActivityIndicator color="#ffffff" />
              </View>
            ) : profileImage ? (
              <Image source={{ uri: profileImage }} style={[styles.heroAvatar, { borderRadius: radius.full }]} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.full }]}>
                <Text style={[styles.avatarInitials, { fontFamily: typography.fontFamilies.heading }]}>{initials}</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={{ fontSize: 10 }}>📷</Text>
            </View>
          </Pressable>
          <Text style={[styles.heroName, { fontFamily: typography.fontFamilies.heading, color: '#ffffff' }]}>
            {user?.name || 'Chef'}
          </Text>
          <View style={[styles.rolePill, { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.full }]}>
            <Text style={[styles.roleText, { fontFamily: typography.fontFamilies.primaryBold, color: '#ffffff' }]}>
              👨‍🍳 {cuisineType || 'Home Chef'}
            </Text>
          </View>
          <Text style={[styles.heroEmail, { fontFamily: typography.fontFamilies.primary, color: 'rgba(255,255,255,0.7)' }]}>
            {user?.email || ''}
          </Text>

          {/* Rating pill */}
          <View style={[styles.ratingRow]}>
            <View style={[styles.ratingPill, { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.full }]}>
              <Text style={[styles.ratingText, { color: '#ffffff', fontFamily: typography.fontFamilies.primaryBold }]}>
                ⭐ 4.9  •  240 reviews
              </Text>
            </View>
          </View>
        </View>

        {/* Photo Selection */}
        <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
            Profile Photo
          </Text>
          <Text style={[styles.sectionSub, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            Upload a high quality photo of yourself.
          </Text>
          <View style={styles.photoActions}>
            <Button
              title="Upload from Gallery"
              onPress={handlePickImage}
              loading={uploading}
              disabled={uploading}
              style={{ flex: 1 }}
            />
            {profileImage && (
              <Button
                title="Remove"
                variant="outline"
                onPress={handleRemoveImage}
                disabled={uploading}
                style={{ marginLeft: 10 }}
              />
            )}
          </View>
        </View>

        {/* Edit Profile */}
        <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
            Profile Details
          </Text>

          <Input
            label="Cuisine Specialty"
            value={cuisineType}
            onChangeText={setCuisineType}
            placeholder="Italian, Spanish, Bakery..."
          />
          <Input
            label="Chef Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell customers about your cooking passion..."
            multiline
          />
          <Button
            title="Save Profile"
            onPress={handleSaveProfile}
            loading={saving}
            disabled={saving}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Quick Links */}
        <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
            Settings & Support
          </Text>
          <TouchableOpacity 
            style={styles.quickLink}
            onPress={() => navigation.navigate('ChefChatList')}
          >
            <MessageCircle color={colors.primary} size={20} style={{ marginRight: 12 }} />
            <Text style={[styles.quickLinkText, { color: colors.text, fontFamily: typography.fontFamilies.primary }]}>Customer Chats</Text>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity 
            style={styles.quickLink}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Shield color={colors.primary} size={20} style={{ marginRight: 12 }} />
            <Text style={[styles.quickLinkText, { color: colors.text, fontFamily: typography.fontFamilies.primary }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <Pressable
          style={[styles.logoutBtn, { borderColor: '#FF3B30', borderRadius: radius.default }]}
          onPress={() => {
            Alert.alert('Log Out', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log Out', style: 'destructive', onPress: logout },
            ]);
          }}
        >
          <Text style={[styles.logoutText, { color: '#FF3B30', fontFamily: typography.fontFamilies.primaryBold }]}>
            🚪 Log Out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 50 },
  heroHeader: {
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
  },
  heroAvatar: { width: 80, height: 80, objectFit: 'cover', marginBottom: 12 },
  avatarFallback: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarInitials: { fontSize: 26, fontWeight: '800', color: '#ffffff' },
  heroName: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  rolePill: { paddingHorizontal: 14, paddingVertical: 5, marginBottom: 6 },
  roleText: { fontSize: 12 },
  heroEmail: { fontSize: 12 },
  ratingRow: { marginTop: 12 },
  ratingPill: { paddingHorizontal: 14, paddingVertical: 6 },
  ratingText: { fontSize: 12 },
  editBadge: {
    position: 'absolute',
    bottom: 12,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 18,
    borderWidth: 1,
    borderRadius: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  sectionSub: { fontSize: 12, marginBottom: 12 },
  photoActions: { flexDirection: 'row' },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  quickLinkText: { fontSize: 15 },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#FF3B3008',
    borderRadius: 14,
  },
  logoutText: { fontSize: 15 },
});
