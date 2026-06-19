import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, SafeAreaView, ScrollView, Image } from 'react-native';
import apiClient from '../../config/api';
import { useAuthStore } from '../../store/store';
import { useTheme } from '../../theme';
import { ProfileHeader, Card, Button, Input, Divider } from '../../components';

const AVATAR_PRESETS = [
  { name: 'Chef Red', url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&q=80', base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQGAb6eGQQAAAABJRU5ErkJggg==' },
  { name: 'Chef Green', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=120&q=80', base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' },
  { name: 'Chef Blue', url: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=120&q=80', base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPjPUAwADoYBgFV562kAAAAASUVORK5CYII==' }
];

export default function ChefProfileScreen() {
  const { user, token, logout } = useAuthStore();
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
      const headers = { Authorization: `Bearer ${token}` };
      const res = await apiClient.get('/api/chef/profile', { headers });
      
      const profile = res.data.data;
      setBio(profile.bio || '');
      setCuisineType(profile.cuisine_type || '');
      setProfileImage(profile.profile_image || null);
    } catch (error) {
      console.error('Fetch profile error:', error);
      Alert.alert('Error', 'Failed to fetch your profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const profilePayload = {
        bio,
        cuisine_type: cuisineType,
      };

      await apiClient.put('/api/chef/profile', profilePayload, { headers });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile details');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPreset = async (base64) => {
    setUploading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await apiClient.post('/api/chef/profile/image', { imageBase64: base64 }, { headers });

      const imageUrl = res.data.data.profile_image;
      setProfileImage(imageUrl);
      Alert.alert('Success', 'Profile photo updated successfully!');
    } catch (error) {
      console.error('Upload avatar error:', error);
      Alert.alert('Upload Failed', error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.containerPaddingMobile }]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name={user?.name || 'Chef'}
          avatarUrl={profileImage}
          roleLabel="Chef Specialist"
          subtext={user?.email || 'chef@nudgify.test'}
          rating={4.9}
          reviewsCount={240}
        />

        <View style={styles.presetsWrapper}>
          <Text style={[styles.selectText, { color: colors.mutedText, fontFamily: typography.fontFamilies.primaryBold, fontSize: typography.sizes.xs }]}>
            SELECT PROFILE PHOTO PRESET
          </Text>
          <View style={styles.presetContainer}>
            {AVATAR_PRESETS.map((preset, idx) => (
              <Pressable
                key={idx}
                style={styles.presetBtn}
                onPress={() => handleUploadPreset(preset.base64)}
                disabled={uploading}
              >
                <Image
                  source={{ uri: preset.url }}
                  style={[styles.presetThumb, { borderRadius: radius.full, borderColor: colors.border }]}
                />
                <Text style={[styles.presetName, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                  {preset.name.split(' ')[1]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.form}>
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
            title="Save Profile Details"
            onPress={handleSaveProfile}
            loading={saving}
            disabled={saving}
            style={{ marginTop: spacing.stackSm }}
          />
        </View>

        <Button
          title="Log Out"
          variant="outline"
          onPress={logout}
          style={StyleSheet.flatten([styles.logoutBtn, { borderColor: colors.error, marginTop: spacing.stackLg * 2 }])}
          textStyle={{ color: colors.error }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  presetsWrapper: {
    marginVertical: 16,
  },
  selectText: {
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  presetContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  presetBtn: {
    alignItems: 'center',
  },
  presetThumb: {
    width: 48,
    height: 48,
    borderWidth: 1.5,
  },
  presetName: {
    fontSize: 10,
    marginTop: 4,
  },
  form: {
    width: '100%',
    marginVertical: 12,
  },
  logoutBtn: {
    width: '100%',
  },
});
