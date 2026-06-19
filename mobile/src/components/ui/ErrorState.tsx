import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react-native';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryTitle?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  retryTitle = 'Try Again',
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.error + '15' }]}>
        <AlertCircle size={40} color={colors.error} />
      </View>
      <Text
        style={[
          styles.title,
          {
            fontSize: typography.sizes.lg,
            fontFamily: typography.fontFamilies.heading,
            fontWeight: typography.weights.bold,
            color: colors.text,
            marginBottom: spacing.xs,
          },
        ]}
      >
        Oops! Something went wrong
      </Text>
      <Text
        style={[
          styles.message,
          {
            fontSize: typography.sizes.sm,
            fontFamily: typography.fontFamilies.primary,
            color: colors.mutedText,
            marginBottom: spacing.lg,
          },
        ]}
      >
        {message || 'We encountered an unexpected error. Please check your internet connection and try again.'}
      </Text>
      {onRetry && (
        <Button title={retryTitle} onPress={onRetry} variant="primary" style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  button: {
    minWidth: 160,
  },
});
