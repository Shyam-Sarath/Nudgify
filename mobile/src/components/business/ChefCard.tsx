import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface ChefUser {
  name?: string;
  email?: string;
}

interface ChefData {
  user_id: number;
  cuisine_type?: string;
  bio?: string;
  rating?: number;
  profile_image?: string;
  delivery_time?: string;
  users?: ChefUser;
}

interface Props {
  chef: ChefData;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ChefCard: React.FC<Props> = ({ chef, onPress, style }) => {
  const { colors, spacing, radius, typography, icons } = useTheme();

  const StarIcon = icons.rating;
  const MapPinIcon = icons.location;

  const chefName = chef.users?.name || 'Chef';
  const profileImage =
    chef.profile_image ||
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80';

  return (
    <Card variant="elevated" isHero style={[styles.container, style]}>
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: profileImage }} style={styles.image} />
          <View style={styles.gradientOverlay} />
          
          <View style={styles.badgeContainer}>
            <Badge label={chef.cuisine_type || 'Specialist'} variant="primary" />
          </View>

          <View style={styles.infoOverlay}>
            <Text style={[styles.name, { color: '#ffffff', fontFamily: typography.fontFamilies.heading }]}>
              {chefName}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <StarIcon size={12} color="#ffffff" style={{ marginRight: 2 }} />
                <Text style={[styles.metaText, { color: '#ffffff', fontFamily: typography.fontFamilies.primaryMedium }]}>
                  {chef.rating?.toFixed(1) || '5.0'}
                </Text>
              </View>
              <Text style={[styles.bullet, { color: 'rgba(255,255,255,0.7)' }]}>•</Text>
              <View style={styles.metaItem}>
                <MapPinIcon size={12} color="#ffffff" style={{ marginRight: 2 }} />
                <Text style={[styles.metaText, { color: '#ffffff', fontFamily: typography.fontFamilies.primaryMedium }]}>
                  Local Chef
                </Text>
              </View>
              <Text style={[styles.bullet, { color: 'rgba(255,255,255,0.7)' }]}>•</Text>
              <View style={styles.metaItem}>
                <Text style={[styles.metaText, { color: '#ffffff', fontFamily: typography.fontFamilies.primaryMedium }]}>
                  ⏱ {chef.delivery_time || '25-40 min'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.footer, { backgroundColor: colors.surface }]}>
          <Text
            numberOfLines={2}
            style={[
              styles.bio,
              {
                color: colors.mutedText,
                fontFamily: typography.fontFamilies.primary,
                fontSize: typography.sizes.sm,
              },
            ]}
          >
            {chef.bio || 'Cooking authentic, freshly prepared homemade recipes with local organic ingredients.'}
          </Text>
        </View>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    marginBottom: 20,
  },
  pressable: {
    width: '100%',
  },
  imageWrapper: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(51, 69, 55, 0.4)', // tint overlay
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
  },
  bullet: {
    marginHorizontal: 8,
    fontSize: 12,
  },
  footer: {
    padding: 16,
  },
  bio: {
    lineHeight: 18,
  },
});
export default ChefCard;
