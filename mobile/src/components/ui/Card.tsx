import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

type CardVariant = 'elevated' | 'flat' | 'outlined';

interface Props {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  isHero?: boolean;
}

export const Card: React.FC<Props> = ({
  children,
  variant = 'flat',
  style,
  isHero = false,
}) => {
  const { colors, radius, shadows, spacing } = useTheme();

  const cardRadius = isHero ? radius.lg : radius.md;

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          ...shadows.md,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.none,
        };
      case 'flat':
      default:
        return {
          backgroundColor: colors.surfaceContainerLow,
          borderWidth: 0,
          ...shadows.none,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: cardRadius,
          padding: spacing.unit * 2,
        },
        getVariantStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
export default Card;
