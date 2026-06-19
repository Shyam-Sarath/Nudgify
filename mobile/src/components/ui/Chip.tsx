import React from 'react';
import { Text, StyleSheet, Pressable, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Chip: React.FC<Props> = ({
  label,
  active,
  onPress,
  style,
  textStyle,
}) => {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? colors.primary : colors.surfaceContainerLow,
          borderRadius: radius.full,
          paddingHorizontal: spacing.unit * 3,
          paddingVertical: spacing.unit * 1.25,
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: active ? colors.background : colors.mutedText,
            fontFamily: active
              ? typography.fontFamilies.primaryBold
              : typography.fontFamilies.primaryMedium,
            fontSize: typography.sizes.sm,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
export default Chip;
