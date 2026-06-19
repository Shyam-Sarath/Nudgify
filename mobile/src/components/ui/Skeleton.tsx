import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface Props {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<Props> = ({
  width = '100%',
  height = 20,
  borderRadius,
  style,
}) => {
  const { colors, radius } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    shimmerLoop.start();
    return () => shimmerLoop.stop();
  }, []);

  const interpolatedBg = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      colors.surfaceContainerLow || '#F4F1EA',
      colors.surfaceContainerHighest || '#E8E5DE',
    ],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height: height as any,
          borderRadius: borderRadius ?? radius.default,
          backgroundColor: interpolatedBg,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});
export default Skeleton;
