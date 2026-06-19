import React from 'react';
import { View, Text, StyleSheet, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import Chip from '../ui/Chip';

interface Props {
  title: string;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const MenuSection: React.FC<Props> = ({
  title,
  categories,
  selectedCategory,
  onSelectCategory,
  style,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          {title}
        </Text>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              active={selectedCategory === category}
              onPress={() => onSelectCategory(category)}
              style={styles.chip}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: 16,
  },
  scrollContent: {
    alignItems: 'center',
    paddingRight: 16,
  },
  chip: {
    marginLeft: 8,
  },
});
export default MenuSection;
