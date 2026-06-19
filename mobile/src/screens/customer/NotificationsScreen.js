import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import { useTheme } from '../../theme';
import { NotificationCard } from '../../components';

export default function NotificationsScreen() {
  const { colors, spacing, typography } = useTheme();

  const mockAlerts = [
    { id: 1, title: 'Order Accepted!', description: 'Chef Marcelle accepted your order #ORD-2841.', timeLabel: '5 mins ago', iconName: 'checkCircle' },
    { id: 2, title: 'Special Promo', description: 'Get 20% off from local baker Elena rodriguez.', timeLabel: '2 hours ago', iconName: 'notifications' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <Text style={[styles.title, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Notifications
        </Text>
      </View>

      <FlatList
        data={mockAlerts}
        renderItem={({ item }) => (
          <NotificationCard
            title={item.title}
            description={item.description}
            timeLabel={item.timeLabel}
            iconName={item.iconName}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.containerPaddingMobile }]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
});
