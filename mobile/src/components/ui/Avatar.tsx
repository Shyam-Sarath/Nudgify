import React from 'react';
import { View, Image, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  source?: string;
  name?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<Props> = ({
  source,
  name,
  size = 'md',
  style,
}) => {
  const { colors, radius, typography } = useTheme();

  const getDimension = () => {
    switch (size) {
      case 'sm':
        return 32;
      case 'lg':
        return 64;
      case 'xl':
        return 80;
      case 'md':
      default:
        return 48;
    }
  };

  const dimension = getDimension();
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: radius.full,
          borderColor: colors.border,
          borderWidth: 1,
          backgroundColor: colors.surfaceContainer,
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, { borderRadius: radius.full }]}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              color: colors.primary,
              fontFamily: typography.fontFamilies.primaryBold,
              fontSize: dimension * 0.4,
            },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  initials: {
    textAlign: 'center',
  },
});
export default Avatar;
