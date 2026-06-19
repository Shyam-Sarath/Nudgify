import React, { useState } from 'react';
import { SafeAreaView, View, Text, Alert, StyleSheet } from 'react-native';
import apiClient from '../config/api';
import { Input, Button } from '../components';
import { useTheme } from '../theme';
import { useAuthStore } from '../store/store';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const { colors, spacing, typography } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            Nudgify
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            Authentic Home Cooked Marketplace
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="chef.julian@nudgify.test"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          <Button
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={{ marginTop: spacing.stackLg }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            Don’t have an account?{' '}
          </Text>
          <Button
            title="Sign Up"
            variant="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.signupButton}
            textStyle={{ fontFamily: typography.fontFamilies.primaryBold }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  signupButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
