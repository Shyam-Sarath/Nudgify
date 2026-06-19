import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const Input: React.FC<Props> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const { colors, spacing, radius, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={[styles.container, { marginBottom: spacing.stackMd }, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.text,
              fontFamily: typography.fontFamilies.primaryMedium,
              marginBottom: spacing.stackSm,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderRadius: radius.default,
            borderWidth: 1,
            borderColor: error ? colors.error : isFocused ? colors.primary : 'transparent',
            paddingHorizontal: spacing.unit * 2,
          },
        ]}
      >
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
            inputStyle,
          ]}
          {...props}
        />
      </View>
      {error && (
        <Text
          style={[
            styles.errorText,
            {
              color: colors.error,
              fontFamily: typography.fontFamilies.primary,
              marginTop: spacing.stackSm,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginLeft: 4,
  },
  inputContainer: {
    height: 54,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
export default Input;
