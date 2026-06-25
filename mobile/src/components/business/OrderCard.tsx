import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface OrderItem {
  id: number;
  quantity: number;
  price: number | string;
  dishes?: { name: string };
}

interface OrderData {
  id: number;
  status: string;
  total_amount: number | string;
  created_at: string;
  delivery_address?: string;
  customer_name?: string;
  chef_name?: string;
  order_items?: OrderItem[];
  customers?: { users?: { name?: string } };
}

interface Props {
  order: OrderData;
  isChef?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onMarkReady?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const STATUS_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  pending:   { label: 'New Order',  emoji: '🕐', color: '#FF6B35', bg: '#FF6B3515' },
  preparing: { label: 'Preparing',  emoji: '🍳', color: '#F59E0B', bg: '#F59E0B15' },
  ready:     { label: 'Ready',      emoji: '✅', color: '#10B981', bg: '#10B98115' },
  completed: { label: 'Completed',  emoji: '🎉', color: '#6366F1', bg: '#6366F115' },
  delivered: { label: 'Delivered',  emoji: '🚀', color: '#3B82F6', bg: '#3B82F615' },
  rejected:  { label: 'Declined',   emoji: '❌', color: '#EF4444', bg: '#EF444415' },
};

export const OrderCard: React.FC<Props> = ({
  order,
  isChef = false,
  onAccept,
  onDecline,
  onMarkReady,
  onPress,
  style,
}) => {
  const { colors, spacing, radius, typography } = useTheme();

  const statusKey = order.status?.toLowerCase() || 'pending';
  const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG['pending'];

  const totalFormatted =
    typeof order.total_amount === 'number'
      ? order.total_amount.toFixed(2)
      : parseFloat(String(order.total_amount || 0)).toFixed(2);

  const formattedDate = new Date(order.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const customerName = order.customer_name || order.customers?.users?.name || 'Customer';
  const itemsText = order.order_items
    ?.map((item) => `${item.dishes?.name || 'Dish'} ×${item.quantity}`)
    .join('  •  ') || 'No items listed';

  return (
    <Card variant="outlined" style={[styles.container, style]}>
      <Pressable onPress={onPress} style={styles.inner}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.orderNum, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
              #NDG-{order.id}
            </Text>
            <Text style={[styles.date, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
              {formattedDate}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: config.bg, borderRadius: radius.full }]}>
            <Text style={styles.statusEmoji}>{config.emoji}</Text>
            <Text style={[styles.statusLabel, { color: config.color, fontFamily: typography.fontFamilies.primaryBold }]}>
              {config.label}
            </Text>
          </View>
        </View>

        {/* Customer name (chef view) */}
        {isChef && (
          <View style={[styles.customerRow, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.sm }]}>
            <Text style={styles.personEmoji}>👤</Text>
            <Text style={[styles.customerName, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
              {customerName}
            </Text>
          </View>
        )}

        {/* Items */}
        <Text style={[styles.items, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]} numberOfLines={2}>
          {itemsText}
        </Text>

        {/* Delivery Address */}
        {order.delivery_address ? (
          <View style={styles.addressRow}>
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={[styles.address, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]} numberOfLines={1}>
              {order.delivery_address}
            </Text>
          </View>
        ) : null}

        {/* Total Row */}
        <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.totalLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            Order Total
          </Text>
          <Text style={[styles.totalAmount, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            ${totalFormatted}
          </Text>
        </View>

        {/* Chef Actions */}
        {isChef && statusKey === 'pending' && (
          <View style={styles.actionsRow}>
            {onDecline && (
              <Button
                title="Decline"
                variant="outline"
                onPress={onDecline}
                style={[styles.actionBtn, { marginRight: 10, borderColor: '#EF4444' }]}
                textStyle={{ color: '#EF4444' }}
              />
            )}
            {onAccept && (
              <Button
                title="✓ Accept"
                variant="primary"
                onPress={onAccept}
                style={styles.actionBtn}
              />
            )}
          </View>
        )}

        {isChef && statusKey === 'preparing' && onMarkReady && (
          <Button
            title="🚀 Mark as Ready"
            variant="secondary"
            onPress={onMarkReady}
            style={styles.fullBtn}
          />
        )}
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  inner: { padding: 4 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNum: { fontSize: 15, fontWeight: '700' },
  date: { fontSize: 11, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  statusEmoji: { fontSize: 12 },
  statusLabel: { fontSize: 11 },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
    gap: 6,
  },
  personEmoji: { fontSize: 13 },
  customerName: { fontSize: 13 },
  items: { fontSize: 13, lineHeight: 18, marginBottom: 6 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 4 },
  addressIcon: { fontSize: 12 },
  address: { fontSize: 12, flex: 1 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  totalLabel: { fontSize: 13 },
  totalAmount: { fontSize: 20, fontWeight: '800' },
  actionsRow: { flexDirection: 'row', marginTop: 4 },
  actionBtn: { flex: 1 },
  fullBtn: { width: '100%', marginTop: 4 },
});

export default OrderCard;
