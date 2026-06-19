import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, Animated, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface Props extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export const SearchBar: React.FC<Props> = ({ containerStyle, ...props }) => {
  const { colors, spacing, radius, typography, icons } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.01,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const SearchIcon = icons.search;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: radius.full,
          borderColor: isFocused ? colors.primary : 'transparent',
          borderWidth: 1,
          paddingHorizontal: spacing.unit * 2,
        },
        containerStyle,
      ]}
    >
      <SearchIcon size={20} color={colors.mutedText} style={styles.icon} />
      <TextInput
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={colors.mutedText}
        style={[
          styles.input,
          {
            color: colors.text,
            fontFamily: typography.fontFamilies.primary,
            fontSize: typography.sizes.sm,
          },
        ]}
        {...props}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
});
export default SearchBar;
