import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import Card from '../ui/Card';

interface Props {
  title: string;
  value: string | number;
  iconName: string;
  trend?: string;
  trendUp?: boolean;
  subElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const StatCard: React.FC<Props> = ({
  title,
  value,
  iconName,
  trend,
  trendUp = true,
  subElement,
  style,
}) => {
  const { colors, spacing, typography, icons } = useTheme();

  // Find icon mapping
  const IconComponent = (icons as any)[iconName] || icons.stats;
  const TrendIcon = icons.trendingUp;

  return (
    <Card variant="flat" style={[styles.container, { backgroundColor: colors.surfaceContainerLow }, style]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.mutedText, fontFamily: typography.fontFamilies.primaryMedium }]}>
            {title}
          </Text>
          <Text style={[styles.value, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            {value}
          </Text>
        </View>
        <View style={styles.iconCircle}>
          <IconComponent size={20} color={colors.secondary} />
        </View>
      </View>

      <View style={styles.footer}>
        {trend && (
          <View style={styles.trendRow}>
            <TrendIcon size={12} color={trendUp ? colors.primary : colors.error} style={styles.trendIcon} />
            <Text
              style={[
                styles.trendText,
                {
                  color: trendUp ? colors.primary : colors.error,
                  fontFamily: typography.fontFamilies.primaryBold,
                },
              ]}
            >
              {trend}
            </Text>
          </View>
        )}
        {subElement && <View style={styles.subElementContainer}>{subElement}</View>}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 13,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  iconCircle: {
    padding: 8,
  },
  footer: {
    marginTop: 12,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    marginRight: 4,
  },
  trendText: {
    fontSize: 11,
  },
  subElementContainer: {
    width: '100%',
  },
});
export default StatCard;
