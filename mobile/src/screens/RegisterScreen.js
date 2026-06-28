import React, { useState } from 'react';
import { ScrollView, View, Text, Alert, StyleSheet, Pressable } from 'react-native';
import apiClient from '../config/api';
import { useAuthStore } from '../store/store';
import { Input, Button } from '../components';
import { useTheme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // default to customer
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const { colors, spacing, radius, typography } = useTheme();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/auth/register', { name, email, password, role });
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.containerPaddingMobile },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.logo, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
              Nudgify
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
              Create your culinary account
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Julian V."
            />
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="julian@nudgify.test"
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

            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontFamily: typography.fontFamilies.primaryMedium,
                  fontSize: typography.sizes.sm,
                  marginBottom: spacing.stackSm,
                  marginTop: spacing.stackMd,
                },
              ]}
            >
              Register As
            </Text>
            
            <View style={styles.roleContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.roleButton,
                  {
                    borderColor: role === 'customer' ? colors.primary : colors.border,
                    backgroundColor: role === 'customer' ? colors.primaryContainer + '20' : colors.surfaceContainerLow,
                    borderRadius: radius.default,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
                onPress={() => setRole('customer')}
              >
                <Text
                  style={[
                    styles.roleText,
                    {
                      color: role === 'customer' ? colors.primary : colors.mutedText,
                      fontFamily: role === 'customer' ? typography.fontFamilies.primaryBold : typography.fontFamilies.primary,
                    },
                  ]}
                >
                  Customer
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.roleButton,
                  {
                    borderColor: role === 'chef' ? colors.primary : colors.border,
                    backgroundColor: role === 'chef' ? colors.primaryContainer + '20' : colors.surfaceContainerLow,
                    borderRadius: radius.default,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
                onPress={() => setRole('chef')}
              >
                <Text
                  style={[
                    styles.roleText,
                    {
                      color: role === 'chef' ? colors.primary : colors.mutedText,
                      fontFamily: role === 'chef' ? typography.fontFamilies.primaryBold : typography.fontFamilies.primary,
                    },
                  ]}
                >
                  Home Chef
                </Text>
              </Pressable>
            </View>

            <Button
              title="Sign Up"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={{ marginTop: spacing.stackLg * 1.5 }}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
              Already have an account?{' '}
            </Text>
            <Button
              title="Log In"
              variant="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
              textStyle={{ fontFamily: typography.fontFamilies.primaryBold }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  content: {
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
  label: {
    marginLeft: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  roleButton: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  roleText: {
    fontSize: 14,
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
  loginButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
