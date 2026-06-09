import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../store/store';

// local backend API IP - using 10.0.2.2 for Android emulator or localhost for web
const API_URL = 'http://10.0.2.2:5000'; // Fallback to localhost if on web
const API_URL_WEB = 'http://localhost:5000';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      // Try local machine (web) or emulator gateway IP
      let response;
      try {
        response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      } catch (err) {
        // Fallback to web address
        response = await axios.post(`${API_URL_WEB}/api/auth/login`, { email, password });
      }

      const { user, token } = response.data.data;
      if (user.role === 'admin') {
        Alert.alert('Error', 'Admins must log in through the web portal');
        setLoading(false);
        return;
      }

      setAuth(user, token);
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Invalid email or password';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.logo}>Nudgify</Text>
          <Text style={styles.subtitle}>Homemade food marketplace</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="chef.alice@nudgify.test"
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

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
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
    marginBottom: 35,
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
