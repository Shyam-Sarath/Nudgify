import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert, Pressable } from 'react-native';
import { useAuthStore } from '../../store/store';
import { useTheme } from '../../theme';
import { ProfileHeader, Card, Button, Input, Divider } from '../../components';
import apiClient from '../../config/api';

export default function CustomerProfileScreen({ navigation }) {
  const { user, token, setAuth, logout } = useAuthStore();
  const { colors, spacing, radius, typography } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await apiClient.put('/api/customer/profile', { name }, { headers });
      
      const updatedUser = { ...user, name: res.data.data.name };
      setAuth(updatedUser, token);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Update customer profile error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: spacing.containerPaddingMobile, paddingTop: 24 }}>
        {/* Profile Header */}
        <ProfileHeader
          name={name}
          roleLabel="Customer"
          subtext={user?.email || 'customer@nudgify.test'}
        />

        <View style={styles.form}>
          <Input
            label="Edit Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
          />
          <Button
            title="Save Name Changes"
            onPress={handleSaveProfile}
            loading={saving}
            disabled={saving}
            style={{ marginTop: spacing.stackSm }}
          />
        </View>

        {/* Menu Options */}
        <Card variant="flat" style={styles.menuGroup}>
          <Pressable style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
            <Text style={[styles.menuText, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
              Settings
            </Text>
            <Text style={{ color: colors.mutedText }}>→</Text>
          </Pressable>
          <Divider />
          <Pressable style={styles.menuItem} onPress={() => navigation.navigate('Notifications')}>
            <Text style={[styles.menuText, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
              Notifications
            </Text>
            <Text style={{ color: colors.mutedText }}>→</Text>
          </Pressable>
        </Card>

        {/* Logout */}
        <Button
          title="Log Out"
          variant="outline"
          onPress={logout}
          style={StyleSheet.flatten([styles.logoutBtn, { borderColor: colors.error, marginTop: spacing.stackLg * 2 }])}
          textStyle={{ color: colors.error }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    marginVertical: 20,
  },
  menuGroup: {
    padding: 16,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 15,
  },
  logoutBtn: {
    width: '100%',
  },
});
