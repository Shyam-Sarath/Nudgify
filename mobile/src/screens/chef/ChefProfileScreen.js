import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../../store/store';

const API_URL = 'http://10.0.2.2:5000';
const API_URL_WEB = 'http://localhost:5000';

export default function ChefProfileScreen() {
  const { user, token, logout } = useAuthStore();
  const [bio, setBio] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let res;
      try {
        res = await axios.get(`${API_URL}/api/chef/profile`, { headers });
      } catch {
        res = await axios.get(`${API_URL_WEB}/api/chef/profile`, { headers });
      }
      
      const profile = res.data.data;
      setBio(profile.bio || '');
      setCuisineType(profile.cuisine_type || '');
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

      let res;
      try {
        res = await axios.put(`${API_URL}/api/chef/profile`, profilePayload, { headers });
      } catch {
        res = await axios.put(`${API_URL_WEB}/api/chef/profile`, profilePayload, { headers });
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={styles.loadingText}>Fetching profile details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'C'}</Text>
            </View>
          </View>

          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Cuisine Specialty</Text>
            <TextInput
              style={styles.input}
              value={cuisineType}
              onChangeText={setCuisineType}
              placeholder="Italian, Indian, Fusion..."
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Chef Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell customers about your cooking background and passion..."
              placeholderTextColor="#888"
              multiline
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Profile</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f5f7',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#1f2687',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e1e24',
  },
  email: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  form: {
    width: '100%',
    marginVertical: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e1e24',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1e1e24',
    backgroundColor: '#f8fafc',
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  saveBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#ff6b35',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  logoutBtn: {
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
