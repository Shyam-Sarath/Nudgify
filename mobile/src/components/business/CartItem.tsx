import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useTheme } from '../../theme';
import Card from '../ui/Card';

interface Props {
  item: {
    id: number;
    name: string;
    price: number | string;
    quantity: number;
    image_url?: string;
  };
  onAdd: () => void;
  onRemove: () => void;
}

export const CartItem: React.FC<Props> = ({ item, onAdd, onRemove }) => {
  const { colors, spacing, radius, typography } = useTheme();

  const imageUrl =
    item.image_url ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80';

  const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price);
  const totalItemPrice = priceNum * item.quantity;

  return (
    <Card variant="outlined" style={styles.container}>
      <Image source={{ uri: imageUrl }} style={[styles.image, { borderRadius: radius.default }]} />
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamilies.heading }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.price, { color: colors.primary, fontFamily: typography.fontFamilies.primaryBold }]}>
          ${priceNum.toFixed(2)} each
        </Text>
      </View>

      <View style={styles.rightColumn}>
        <Text style={[styles.totalPrice, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
          ${totalItemPrice.toFixed(2)}
        </Text>
        
        <View style={[styles.quantityControl, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.full }]}>
          <Pressable
            style={({ pressed }) => [
              styles.qtyBtn,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.full,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={onRemove}
          >
            <Text style={[styles.qtyBtnText, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>-</Text>
          </Pressable>
          <Text style={[styles.quantity, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
            {item.quantity}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.qtyBtn,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.full,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={onAdd}
          >
            <Text style={[styles.qtyBtnText, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>+</Text>
          </Pressable>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 64,
    height: 64,
    objectFit: 'cover',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
  },
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: -2, // center character offset
  },
  quantity: {
    fontSize: 13,
    fontWeight: '700',
    marginHorizontal: 10,
  },
});
export default CartItem;
