import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuthStore } from '../../store/store';

export default function CustomerProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user?.name || 'Customer Name'}</Text>
          <Text style={styles.email}>{user?.email || 'customer@example.com'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role?.toUpperCase() || 'CUSTOMER'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    shadowColor: '#1f2687',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e1e24',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  roleBadge: {
    marginTop: 12,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  logoutBtn: {
    width: '100%',
    height: 52,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
