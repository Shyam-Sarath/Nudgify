import React, { useRef } from 'react';
import { Text, StyleSheet, ActivityIndicator, Animated, Pressable, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'text';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const { colors, spacing, radius, typography } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: colors.surfaceContainer,
          text: colors.primary,
          border: 'transparent',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: colors.primary,
          border: colors.border,
        };
      case 'text':
        return {
          bg: 'transparent',
          text: colors.primary,
          border: 'transparent',
        };
      case 'primary':
      default:
        return {
          bg: colors.primary,
          text: colors.background,
          border: 'transparent',
        };
    }
  };

  const currentStyles = getStyles();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: currentStyles.bg,
            borderColor: currentStyles.border,
            borderWidth: variant === 'outline' ? 1 : 0,
            borderRadius: radius.full,
            paddingVertical: spacing.unit * 1.5,
            paddingHorizontal: spacing.unit * 3,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={currentStyles.text} size="small" />
        ) : (
          <Animated.View style={styles.contentContainer}>
            {icon && <Animated.View style={{ marginRight: spacing.unit }}>{icon}</Animated.View>}
            <Text
              style={[
                styles.text,
                {
                  color: currentStyles.text,
                  fontFamily: typography.fontFamilies.primaryBold,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});
export default Button;
