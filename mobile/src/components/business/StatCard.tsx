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
  accentColor?: string;
  subElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const StatCard: React.FC<Props> = ({
  title,
  value,
  iconName,
  trend,
  trendUp = true,
  accentColor,
  subElement,
  style,
}) => {
  const { colors, spacing, radius, typography, icons } = useTheme();

  const IconComponent = (icons as any)[iconName] || icons.stats;
  const accent = accentColor || colors.primary;

  return (
    <Card variant="flat" style={[styles.container, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.default }, style]}>
      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: accent + '18', borderRadius: radius.default }]}>
        <IconComponent size={18} color={accent} />
      </View>

      <Text style={[styles.value, { color: accent, fontFamily: typography.fontFamilies.heading }]}>
        {value}
      </Text>

      <Text style={[styles.title, { color: colors.mutedText, fontFamily: typography.fontFamilies.primaryMedium }]}>
        {title}
      </Text>

      {trend && (
        <View style={[styles.trendRow, { backgroundColor: (trendUp ? colors.primary : colors.error) + '12', borderRadius: radius.sm }]}>
          <Text style={[styles.trendText, {
            color: trendUp ? colors.primary : colors.error,
            fontFamily: typography.fontFamilies.primaryBold,
          }]}>
            {trendUp ? '↑ ' : '↓ '}{trend}
          </Text>
        </View>
      )}

      {subElement && <View style={{ marginTop: 8 }}>{subElement}</View>}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    minHeight: 140,
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    marginBottom: 10,
  },
  trendRow: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  trendText: {
    fontSize: 10,
  },
});

export default StatCard;
