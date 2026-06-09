import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../store/store';

const API_URL = 'http://10.0.2.2:5000';
const API_URL_WEB = 'http://localhost:5000';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // default to customer
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      let response;
      try {
        response = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, role });
      } catch (err) {
        response = await axios.post(`${API_URL_WEB}/api/auth/register`, { name, email, password, role });
      }

      const { user, token } = response.data.data;
      setAuth(user, token);
    } catch (error) {
      console.error('Registration error:', error);
      const msg = error.response?.data?.message || 'Email already exists or invalid data';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.logo}>Nudgify</Text>
            <Text style={styles.subtitle}>Create your marketplace account</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="john@example.com"
              placeholderTextColor="#888"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#888"
              secureTextEntry
            />

            <Text style={styles.label}>Register As</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'customer' && styles.roleActive]}
                onPress={() => setRole('customer')}
              >
                <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>Customer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.roleButton, role === 'chef' && styles.roleActive]}
                onPress={() => setRole('chef')}
              >
                <Text style={[styles.roleText, role === 'chef' && styles.roleTextActive]}>Home Chef</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Log In</Text>
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    shadowColor: '#1f2687',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ff6b35',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e1e24',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1e1e24',
    backgroundColor: '#f8fafc',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  roleButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f8fafc',
  },
  roleActive: {
    borderColor: '#ff6b35',
    backgroundColor: '#fff8f5',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  roleTextActive: {
    color: '#ff6b35',
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
});
