import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary';

interface Props {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<Props> = ({
  label,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const { colors, spacing, radius, typography } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: '#E8F5E9',
          text: colors.success,
        };
      case 'warning':
        return {
          bg: colors.secondaryContainer,
          text: colors.onSecondaryContainer,
        };
      case 'error':
        return {
          bg: colors.errorContainer,
          text: colors.error,
        };
      case 'info':
        return {
          bg: colors.surfaceContainer,
          text: colors.primary,
        };
      case 'primary':
      default:
        return {
          bg: colors.primaryContainer,
          text: colors.onPrimaryContainer,
        };
    }
  };

  const currentColors = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: currentColors.bg,
          borderRadius: radius.full,
          paddingHorizontal: spacing.unit * 1.5,
          paddingVertical: spacing.unit * 0.5,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: currentColors.text,
            fontFamily: typography.fontFamilies.primaryBold,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
export default Badge;
