import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

interface Props {
  name: string;
  avatarUrl?: string;
  roleLabel: string;
  subtext?: string;
  rating?: number;
  reviewsCount?: number;
  style?: StyleProp<ViewStyle>;
}

export const ProfileHeader: React.FC<Props> = ({
  name,
  avatarUrl,
  roleLabel,
  subtext,
  rating,
  reviewsCount,
  style,
}) => {
  const { colors, spacing, typography, icons } = useTheme();

  const StarIcon = icons.rating;

  return (
    <View style={[styles.container, style]}>
      <Avatar source={avatarUrl} name={name} size="xl" style={styles.avatar} />
      
      <View style={styles.details}>
        <View style={styles.badgeRow}>
          <Badge label={roleLabel} variant="primary" />
          {rating !== undefined && (
            <View style={styles.ratingContainer}>
              <StarIcon size={14} color={colors.secondary} fill={colors.secondary} style={{ marginRight: 2 }} />
              <Text
                style={[
                  styles.ratingText,
                  { color: colors.secondary, fontFamily: typography.fontFamilies.primaryBold },
                ]}
              >
                {rating.toFixed(1)} {reviewsCount !== undefined ? `(${reviewsCount})` : ''}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
          {name}
        </Text>

        {subtext && (
          <Text style={[styles.subtext, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            {subtext}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    marginRight: 16,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  ratingText: {
    fontSize: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14,
    lineHeight: 18,
  },
});
export default ProfileHeader;
