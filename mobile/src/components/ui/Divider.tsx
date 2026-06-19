import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export const Divider: React.FC<Props> = ({ style }) => {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: colors.border,
          marginVertical: spacing.stackMd,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
});
export default Divider;
