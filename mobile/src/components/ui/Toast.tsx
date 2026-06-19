import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface Props {
  message: string;
  visible: boolean;
  onHide: () => void;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export const Toast: React.FC<Props> = ({
  message,
  visible,
  onHide,
  type = 'success',
  duration = 3000,
  style,
}) => {
  const { colors, spacing, radius, typography } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return colors.error;
      case 'info':
        return colors.primary;
      case 'success':
      default:
        return colors.success;
    }
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: radius.default,
          paddingVertical: spacing.unit * 1.5,
          paddingHorizontal: spacing.unit * 3,
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: '#ffffff',
            fontFamily: typography.fontFamilies.primaryMedium,
            fontSize: typography.sizes.sm,
          },
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    flex: 1,
    textAlign: 'center',
  },
});
export default Toast;
