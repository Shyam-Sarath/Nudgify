import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/store';
import { useTheme } from '../../theme';
import { Input, Button, Divider } from '../../components';
import apiClient from '../../config/api';

const MENU_ITEMS = [
  { icon: '🔔', label: 'Notifications', screen: 'Notifications' },
  { icon: '⚙️', label: 'Settings', screen: 'Settings' },
];

export default function CustomerProfileScreen({ navigation }) {
  const { user, setAuth, logout } = useAuthStore();
  const { colors, spacing, radius, typography } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editMode, setEditMode] = useState(false);

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
      uploadImage(result.assets[0].base64, result.assets[0].uri);
    }
  };

  const uploadImage = async (base64String, localUri) => {
    setUploadingImage(true);
    try {
      const payload = {
        imageBase64: `data:image/jpeg;base64,${base64String}`
      };
      const res = await apiClient.post('/api/customer/profile/image', payload);
      
      const newUrl = res.data.data.profile_image;
      const updatedUser = { ...user, profile_image: newUrl };
      setAuth(updatedUser, useAuthStore.getState().token);
      
      Alert.alert('Success', 'Profile image updated successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to upload profile image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      const res = await apiClient.put('/api/customer/profile', { name });
      const updatedUser = { ...user, name: res.data.data.name };
      setAuth(updatedUser, useAuthStore.getState().token);
      setEditMode(false);
      Alert.alert('✅ Saved', 'Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.name || 'U')
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
          <Pressable onPress={handlePickImage} style={[styles.avatarCircle, { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.full, overflow: 'hidden' }]}>
            {uploadingImage ? (
              <ActivityIndicator color="#ffffff" />
            ) : user?.profile_image ? (
              <Image source={{ uri: user.profile_image }} style={{ width: 80, height: 80, borderRadius: 40 }} />
            ) : (
              <Text style={[styles.avatarInitials, { fontFamily: typography.fontFamilies.heading }]}>
                {initials}
              </Text>
            )}
            <View style={styles.editBadge}>
              <Text style={{ fontSize: 10 }}>📷</Text>
            </View>
          </Pressable>
          <Text style={[styles.heroName, { fontFamily: typography.fontFamilies.heading, color: '#ffffff' }]}>
            {user?.name || 'Your Name'}
          </Text>
          <View style={[styles.rolePill, { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.full }]}>
            <Text style={[styles.roleText, { fontFamily: typography.fontFamilies.primaryBold, color: '#ffffff' }]}>
              🍽️ Customer
            </Text>
          </View>
          <Text style={[styles.heroEmail, { fontFamily: typography.fontFamilies.primary, color: 'rgba(255,255,255,0.7)' }]}>
            {user?.email || ''}
          </Text>
        </View>

        {/* Edit Profile Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.default }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
              Profile Info
            </Text>
            <Pressable onPress={() => setEditMode(!editMode)}>
              <Text style={[styles.editToggle, { color: colors.primary, fontFamily: typography.fontFamilies.primaryBold }]}>
                {editMode ? 'Cancel' : '✏️ Edit'}
              </Text>
            </Pressable>
          </View>

          {editMode ? (
            <>
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
              />
              <Button
                title="Save Changes"
                onPress={handleSaveProfile}
                loading={saving}
                disabled={saving}
                style={{ marginTop: 8 }}
              />
            </>
          ) : (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                Display Name
              </Text>
              <Text style={[styles.infoValue, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
                {user?.name || '—'}
              </Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.default }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading, marginBottom: 8 }]}>
            Preferences
          </Text>
          {MENU_ITEMS.map((item, idx) => (
            <View key={item.screen}>
              {idx > 0 && <Divider />}
              <Pressable
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconBox, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.sm }]}>
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
                    {item.label}
                  </Text>
                </View>
                <Text style={[styles.menuChevron, { color: colors.mutedText }]}>›</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* App Info */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.default }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading, marginBottom: 8 }]}>
            About
          </Text>
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>Version</Text>
            <Text style={[styles.aboutValue, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>1.0.0</Text>
          </View>
          <Divider />
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>Platform</Text>
            <Text style={[styles.aboutValue, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>Nudgify</Text>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          style={[styles.logoutBtn, { backgroundColor: '#FF3B3015', borderRadius: radius.default, borderColor: '#FF3B30', borderWidth: 1 }]}
          onPress={() => {
            Alert.alert('Log Out', 'Are you sure you want to log out?', [
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
  scrollContent: { paddingBottom: 40 },
  heroHeader: {
    paddingTop: 32,
    paddingBottom: 36,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
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
  avatarInitials: { fontSize: 28, fontWeight: '800', color: '#ffffff' },
  heroName: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  rolePill: { paddingHorizontal: 14, paddingVertical: 5, marginBottom: 8 },
  roleText: { fontSize: 12 },
  heroEmail: { fontSize: 12, marginTop: 4 },
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 18,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  editToggle: { fontSize: 13 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 14 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconBox: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  menuIcon: { fontSize: 16 },
  menuLabel: { fontSize: 14 },
  menuChevron: { fontSize: 22, fontWeight: '300' },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  aboutLabel: { fontSize: 13 },
  aboutValue: { fontSize: 13 },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutText: { fontSize: 15 },
});
