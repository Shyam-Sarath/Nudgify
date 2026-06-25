import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, Switch, Alert } from 'react-native';
import { useTheme } from '../../theme';
import { Card, Divider } from '../../components';

export default function SettingsScreen({ navigation }) {
  const { colors, spacing, radius, typography } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 18, color: colors.primary }}>← Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Settings
        </Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={{ paddingHorizontal: spacing.containerPaddingMobile, paddingTop: 16 }}>
        <Card variant="flat" style={styles.settingsGroup}>
          <View style={styles.row}>
            <Text style={[styles.rowText, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
              Push Notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
          <Divider />
          <Pressable style={styles.row} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Text style={[styles.rowText, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
              Privacy & Security
            </Text>
            <Text style={{ color: colors.mutedText }}>→</Text>
          </Pressable>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  settingsGroup: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowText: {
    fontSize: 15,
  },
});
