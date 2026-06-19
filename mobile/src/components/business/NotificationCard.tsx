import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import Card from '../ui/Card';

interface Props {
  title: string;
  description: string;
  timeLabel: string;
  iconName?: string;
  style?: StyleProp<ViewStyle>;
}

export const NotificationCard: React.FC<Props> = ({
  title,
  description,
  timeLabel,
  iconName = 'notifications',
  style,
}) => {
  const { colors, spacing, typography, icons } = useTheme();

  // Find icon mapping
  const IconComponent = (icons as any)[iconName] || icons.notifications;

  return (
    <Card variant="outlined" style={[styles.container, style]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surfaceContainer }]}>
        <IconComponent size={18} color={colors.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
          {title}
        </Text>
        <Text style={[styles.description, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
          {description}
        </Text>
        <Text style={[styles.time, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary, fontSize: typography.sizes.xs }]}>
          {timeLabel}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  time: {
    opacity: 0.7,
  },
});
export default NotificationCard;
