import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, Alert } from 'react-native';
import { useTheme } from '../../theme';
import { Button, Card } from '../../components';

export default function DishDetailsScreen({ route, navigation }) {
  const { dish } = route.params;
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 18, color: colors.primary }}>← Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]} numberOfLines={1}>
          {dish.name}
        </Text>
        <View style={{ width: 20 }} />
      </View>

      <Image source={{ uri: dish.image_url }} style={styles.image} />
      
      <View style={[styles.content, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <Text style={[styles.dishName, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
          {dish.name}
        </Text>
        <Text style={[styles.price, { color: colors.primary, fontFamily: typography.fontFamilies.primaryBold }]}>
          ${parseFloat(dish.price).toFixed(2)}
        </Text>
        <Text style={[styles.desc, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
          {dish.description || 'Delicious homemade recipe prepared fresh by your local chef.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 260,
    objectFit: 'cover',
  },
  content: {
    marginTop: 20,
  },
  dishName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
  },
});
