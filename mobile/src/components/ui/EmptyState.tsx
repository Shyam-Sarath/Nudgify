import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import Button from './Button';

interface Props {
  iconName?: string;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<Props> = ({
  iconName = 'search',
  title,
  description,
  actionTitle,
  onAction,
  style,
}) => {
  const { colors, spacing, typography, icons } = useTheme();

  // Find mapped icon or default to 'search'
  const IconComponent = (icons as any)[iconName] || icons.search;

  return (
    <View style={[styles.container, { padding: spacing.unit * 4 }, style]}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.surfaceContainer,
            marginBottom: spacing.stackLg,
          },
        ]}
      >
        <IconComponent size={32} color={colors.primary} />
      </View>
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
            fontFamily: typography.fontFamilies.headingMedium,
            marginBottom: spacing.stackSm,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.description,
          {
            color: colors.mutedText,
            fontFamily: typography.fontFamilies.primary,
            marginBottom: actionTitle ? spacing.stackLg : 0,
          },
        ]}
      >
        {description}
      </Text>
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} variant="secondary" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});
export default EmptyState;
