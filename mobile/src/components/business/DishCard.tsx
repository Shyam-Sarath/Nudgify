import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface DishData {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  image_url?: string;
  prep_time?: string;
  calories?: number | string;
}

interface Props {
  dish: DishData;
  onAddPress?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const DishCard: React.FC<Props> = ({
  dish,
  onAddPress,
  onPress,
  style,
}) => {
  const { colors, spacing, radius, typography, icons } = useTheme();

  const PlusIcon = icons.add;
  const ClockIcon = icons.time;
  const FlameIcon = icons.calories;

  const imageUrl =
    dish.image_url ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';

  const priceFormatted =
    typeof dish.price === 'number'
      ? dish.price.toFixed(2)
      : parseFloat(dish.price).toFixed(2);

  return (
    <Card variant="outlined" style={[styles.container, style]}>
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={[styles.priceTag, { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: radius.full }]}>
            <Text style={[styles.priceText, { color: colors.primary, fontFamily: typography.fontFamilies.primaryBold }]}>
              ${priceFormatted}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamilies.heading }]} numberOfLines={1}>
              {dish.name}
            </Text>
            {onAddPress && (
              <Pressable
                onPress={onAddPress}
                style={({ pressed }) => [
                  styles.addButton,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: radius.full,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <PlusIcon size={16} color={colors.background} />
              </Pressable>
            )}
          </View>

          {dish.description && (
            <Text
              style={[
                styles.description,
                {
                  color: colors.mutedText,
                  fontFamily: typography.fontFamilies.primary,
                  fontSize: typography.sizes.sm,
                },
              ]}
              numberOfLines={2}
            >
              {dish.description}
            </Text>
          )}

          <View style={styles.metaRow}>
            {dish.prep_time && (
              <View style={styles.metaItem}>
                <ClockIcon size={12} color={colors.mutedText} style={{ marginRight: 4 }} />
                <Text style={[styles.metaText, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                  {dish.prep_time}
                </Text>
              </View>
            )}
            {dish.calories && (
              <View style={[styles.metaItem, { marginLeft: spacing.unit * 2 }]}>
                <FlameIcon size={12} color={colors.secondary} style={{ marginRight: 4 }} />
                <Text style={[styles.metaText, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                  {dish.calories} kcal
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    marginBottom: 16,
    overflow: 'hidden',
  },
  pressable: {
    width: '100%',
  },
  imageWrapper: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  priceTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
  },
  details: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    lineHeight: 18,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
  },
});
export default DishCard;
