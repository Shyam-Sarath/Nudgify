import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface OrderItem {
  id: number;
  quantity: number;
  price: number | string;
  dishes?: {
    name: string;
  };
}

interface OrderData {
  id: number;
  status: string;
  total_amount: number | string;
  created_at: string;
  delivery_address?: string;
  order_items?: OrderItem[];
  customers?: {
    users?: {
      name?: string;
    };
  };
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

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
      case 'pending':
        return 'primary';
      case 'preparing':
        return 'warning';
      case 'ready':
        return 'success';
      case 'delivered':
      case 'completed':
        return 'info';
      default:
        return 'error';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status.toLowerCase() === 'pending') return 'New';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const totalFormatted =
    typeof order.total_amount === 'number'
      ? order.total_amount.toFixed(2)
      : parseFloat(order.total_amount).toFixed(2);

  const formattedDate = new Date(order.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const customerName = order.customers?.users?.name || 'Customer';
  const itemsText = order.order_items
    ?.map((item) => `${item.dishes?.name || 'Dish'} x ${item.quantity}`)
    .join(', ') || 'No items listed';

  return (
    <Card variant="outlined" style={[styles.container, style]}>
      <Pressable onPress={onPress}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.orderNumber, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
              #ORD-{order.id}
            </Text>
            <Text style={[styles.date, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
              {formattedDate}
            </Text>
          </View>
          <Badge label={getStatusLabel(order.status)} variant={getStatusVariant(order.status)} />
        </View>

        <View style={[styles.body, { borderBottomColor: colors.border + '50' }]}>
          {isChef && (
            <Text style={[styles.customerInfo, { color: colors.text, fontFamily: typography.fontFamilies.primaryMedium }]}>
              Ordered by {customerName}
            </Text>
          )}
          <Text style={[styles.items, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]} numberOfLines={2}>
            {itemsText}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalAmount, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
              ${totalFormatted}
            </Text>
          </View>
        </View>

        {isChef && order.status.toLowerCase() === 'pending' && (
          <View style={styles.actions}>
            {onDecline && (
              <Button
                title="Decline"
                variant="outline"
                onPress={onDecline}
                style={[styles.actionBtn, { marginRight: spacing.unit * 2 }]}
              />
            )}
            {onAccept && (
              <Button
                title="Accept"
                variant="primary"
                onPress={onAccept}
                style={styles.actionBtn}
              />
            )}
          </View>
        )}

        {isChef && order.status.toLowerCase() === 'preparing' && onMarkReady && (
          <View style={styles.actions}>
            <Button
              title="Mark as Ready"
              variant="secondary"
              onPress={onMarkReady}
              style={styles.fullWidthBtn}
            />
          </View>
        )}
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  body: {
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 12,
  },
  customerInfo: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  items: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
  },
  fullWidthBtn: {
    width: '100%',
  },
});
export default OrderCard;
