import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useTheme } from '../../theme';
import { ArrowLeft } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  rightComponent,
}) => {
  const { colors, spacing, typography, radius } = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colors.surface }}>
      <View
        style={[
          styles.container,
          {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingHorizontal: spacing.lg,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <View style={styles.leftContainer}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={[
                styles.backButton,
                {
                  borderRadius: radius.full,
                  backgroundColor: colors.background,
                  padding: spacing.xs * 1.5,
                  marginRight: spacing.sm,
                },
              ]}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={colors.text} />
            </TouchableOpacity>
          )}
          <Text
            style={[
              styles.title,
              {
                fontSize: typography.sizes.md + 2,
                fontFamily: typography.fontFamilies.heading,
                fontWeight: typography.weights.bold,
                color: colors.text,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        {rightComponent && (
          <View style={styles.rightContainer}>
            {rightComponent}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 54 : 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
