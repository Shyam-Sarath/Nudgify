import { Platform } from 'react-native';

const systemFont = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'sans-serif',
});

export const typography = {
  fontFamilies: {
    primary: 'Inter-Regular',
    primaryMedium: 'Inter-Medium',
    primaryBold: 'Inter-SemiBold',
    heading: 'Manrope-Bold',
    headingMedium: 'Manrope-SemiBold',
    mono: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
  presets: {
    headlineXl: {
      fontFamily: Platform.OS === 'web' ? 'Manrope' : 'Manrope-Bold',
      fontSize: 40,
      fontWeight: '700' as const,
      lineHeight: 48,
    },
    headlineLg: {
      fontFamily: Platform.OS === 'web' ? 'Manrope' : 'Manrope-SemiBold',
      fontSize: 32,
      fontWeight: '600' as const,
      lineHeight: 40,
    },
    headlineLgMobile: {
      fontFamily: Platform.OS === 'web' ? 'Manrope' : 'Manrope-SemiBold',
      fontSize: 28,
      fontWeight: '600' as const,
      lineHeight: 34,
    },
    headlineMd: {
      fontFamily: Platform.OS === 'web' ? 'Manrope' : 'Manrope-SemiBold',
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    bodyLg: {
      fontFamily: Platform.OS === 'web' ? 'Inter' : 'Inter-Regular',
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 28,
    },
    bodyMd: {
      fontFamily: Platform.OS === 'web' ? 'Inter' : 'Inter-Regular',
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    labelMd: {
      fontFamily: Platform.OS === 'web' ? 'Inter' : 'Inter-Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    labelSm: {
      fontFamily: Platform.OS === 'web' ? 'Inter' : 'Inter-SemiBold',
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
    },
  },
};
