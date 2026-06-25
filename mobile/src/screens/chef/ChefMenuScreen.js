import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Alert, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../config/api';
import { useDataStore } from '../../store/store';
import { useTheme } from '../../theme';
import { Card, Button, Input, Modal, Skeleton, EmptyState, Badge, Divider } from '../../components';

export default function ChefMenuScreen() {
  const { colors, spacing, typography, radius } = useTheme();
  const { dishes, setDishes } = useDataStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchDishes();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/api/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Fetch categories error', err);
    }
  };

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/chef/dishes');
      setDishes(res.data.data || []);
    } catch (error) {
      console.error('Fetch dishes error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch dishes');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission needed', 'You need to grant camera roll permissions to upload dish images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleAddDish = async () => {
    if (submitLoading) return; // Prevent double submission

    const trimmedName = name ? name.trim() : '';
    const parsedPrice = parseFloat(price);

    if (!trimmedName) {
      Alert.alert('Validation Error', 'Dish name is required.');
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Validation Error', 'Price must be a valid number greater than 0.');
      return;
    }

    const finalCategory = category === 'Custom' ? customCategory.trim() : category;

    setSubmitLoading(true);
    try {
      // If it's a completely new category, create it globally
      if (category === 'Custom' && finalCategory) {
        try {
          await apiClient.post('/api/categories', { name: finalCategory });
          fetchCategories(); // refresh list
        } catch (e) {
          console.warn('Category might already exist', e);
        }
      }

      const dishPayload = {
        name: trimmedName,
        description,
        price: parsedPrice,
        category: finalCategory || null,
        availability: true,
      };

      console.log('Sending dish payload:', dishPayload);

      const res = await apiClient.post('/api/chef/dishes', dishPayload);
      const newDish = res.data.data;

      // Upload image if selected
      if (selectedImage) {
        await apiClient.post(`/api/chef/dishes/${newDish.id}/image`, { imageBase64: selectedImage });
      }

      Alert.alert('Success', 'Dish added to your menu!');
      setModalVisible(false);
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setCustomCategory('');
      setSelectedImage(null);
      fetchDishes();
    } catch (error) {
      console.error('Add dish error:', error);
      Alert.alert('Failed', error.response?.data?.message || 'Failed to add dish.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteDish = async (dishId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this dish?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/api/chef/dishes/${dishId}`);
              Alert.alert('Success', 'Dish deleted');
              fetchDishes();
            } catch (error) {
              console.error('Delete dish error:', error);
              Alert.alert('Error', 'Failed to delete dish');
            }
          },
        },
      ]
    );
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updatedPayload = { ...item, availability: !item.availability };
      await apiClient.put(`/api/chef/dishes/${item.id}`, updatedPayload);
      fetchDishes();
    } catch (error) {
      console.error('Toggle availability error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update availability');
    }
  };

  const renderDishItem = ({ item }) => (
    <Card variant="outlined" style={[styles.dishCard, { borderRadius: 14 }]}>
      <View style={styles.dishHeader}>
        <Image
          source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80' }}
          style={[styles.dishImage, { borderRadius: 12 }]}
        />
        <View style={styles.dishInfo}>
          <View style={styles.dishTopRow}>
            <Text style={[styles.dishName, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
              {item.name}
            </Text>
            <Pressable
              style={[
                styles.availBadge,
                {
                  borderRadius: radius.full,
                  backgroundColor: item.availability ? '#10B98115' : '#EF444415',
                }
              ]}
              onPress={() => handleToggleAvailability(item)}
            >
              <View style={[styles.availDot, { backgroundColor: item.availability ? '#10B981' : '#EF4444' }]} />
              <Text style={[styles.availText, {
                color: item.availability ? '#10B981' : '#EF4444',
                fontFamily: typography.fontFamilies.primaryBold,
              }]}>
                {item.availability ? 'Live' : 'Hidden'}
              </Text>
            </Pressable>
          </View>

          {item.category ? (
            <View style={[styles.catBadge, { backgroundColor: colors.primary + '15', borderRadius: radius.sm }]}>
              <Text style={[styles.catText, { color: colors.primary, fontFamily: typography.fontFamilies.primaryBold }]}>
                {item.category}
              </Text>
            </View>
          ) : null}

          <Text style={[styles.dishDesc, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]} numberOfLines={2}>
            {item.description || 'No description provided.'}
          </Text>
          <View style={styles.priceDeleteRow}>
            <Text style={[styles.dishPrice, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
              ${parseFloat(item.price).toFixed(2)}
            </Text>
            <Pressable style={styles.deleteBtn} onPress={() => handleDeleteDish(item.id)}>
              <Text style={[styles.deleteText, { color: '#EF4444', fontFamily: typography.fontFamilies.primaryBold }]}>
                🗑 Remove
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingHorizontal: spacing.containerPaddingMobile, backgroundColor: colors.primary }]}>
        <View>
          <Text style={[styles.title, { color: '#ffffff', fontFamily: typography.fontFamilies.heading }]}>
            My Menu
          </Text>
          <Text style={[styles.dishCount, { color: 'rgba(255,255,255,0.7)', fontFamily: typography.fontFamilies.primary }]}>
            {dishes.length} dish{dishes.length !== 1 ? 'es' : ''} on menu
          </Text>
        </View>
        <Pressable
          style={[styles.addBtn, { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.full }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.addBtnText, { color: '#ffffff', fontFamily: typography.fontFamilies.primaryBold }]}>+ Add Dish</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={[styles.skeletonContainer, { paddingHorizontal: spacing.containerPaddingMobile }]}>
          <Skeleton height={120} style={{ marginBottom: 12 }} />
          <Skeleton height={120} style={{ marginBottom: 12 }} />
        </View>
      ) : dishes.length === 0 ? (
        <EmptyState
          iconName="chef"
          title="Empty Menu"
          description="You haven't added any culinary creations to your menu directory yet."
          actionTitle="Create Dish"
          onAction={() => setModalVisible(true)}
        />
      ) : (
        <FlatList
          data={dishes}
          renderItem={renderDishItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.containerPaddingMobile }]}
          onRefresh={fetchDishes}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Dish Modal */}
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Text style={[styles.modalTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Add New Dish
        </Text>

        <Input
          label="Dish Name"
          value={name}
          onChangeText={setName}
          placeholder="Heritage Seafood Paella"
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Bomba saffron rice with tiger prawns and local mussels..."
          multiline
        />

        <View style={styles.row}>
          <Input
            label="Price ($)"
            value={price}
            onChangeText={setPrice}
            placeholder="24.00"
            keyboardType="numeric"
            containerStyle={StyleSheet.flatten({ flex: 1, marginRight: 8 })}
          />
        </View>

        <Text style={[styles.label, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold, fontSize: typography.sizes.sm }]}>
          Category
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {[{ id: 'none', name: 'None' }, ...categories, { id: 'custom', name: 'Custom' }].map((cat) => (
            <Pressable
              key={cat.id || cat.name}
              style={[
                styles.catChip,
                { borderRadius: radius.full, borderColor: colors.border },
                category === cat.name && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setCategory(cat.name === 'None' ? '' : cat.name)}
            >
              <Text style={[
                styles.catChipText,
                { color: colors.text, fontFamily: typography.fontFamilies.primary },
                category === cat.name && { color: '#ffffff', fontFamily: typography.fontFamilies.primaryBold }
              ]}>
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {category === 'Custom' && (
          <Input
            label="New Category Name"
            value={customCategory}
            onChangeText={setCustomCategory}
            placeholder="E.g. Vegan"
            style={{ marginTop: 12 }}
          />
        )}

        <Text style={[styles.label, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold, fontSize: typography.sizes.sm }]}>
          Dish Photo
        </Text>
        
        <View style={styles.photoActionsRow}>
          <Button
            title="Choose Photo"
            onPress={handlePickImage}
            variant="outline"
            style={{ flex: 1, marginRight: selectedImage ? 8 : 0 }}
          />
          {selectedImage && (
            <Button
              title="Remove"
              onPress={() => setSelectedImage(null)}
              variant="outline"
              style={{ paddingHorizontal: 12 }}
            />
          )}
        </View>
        
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        ) : (
          <View style={[styles.previewPlaceholder, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}>
            <Text style={{ color: colors.mutedText, fontFamily: typography.fontFamilies.primary }}>No photo selected</Text>
          </View>
        )}

        <View style={styles.modalActions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => setModalVisible(false)}
            style={[styles.modalBtn, { marginRight: 8 }]}
          />
          <Button
            title="Add Dish"
            onPress={handleAddDish}
            loading={submitLoading}
            disabled={submitLoading}
            style={[styles.modalBtn, { marginLeft: 8 }]}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  dishCount: {
    fontSize: 12,
    marginTop: 2,
  },
  addBtn: {
    paddingVertical: 9,
    paddingHorizontal: 18,
  },
  addBtnText: { fontSize: 13 },
  skeletonContainer: {
    paddingTop: 16,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  dishCard: {
    padding: 14,
    marginBottom: 14,
  },
  dishHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dishImage: {
    width: 70,
    height: 70,
    objectFit: 'cover',
    marginRight: 12,
  },
  dishInfo: {
    flex: 1,
  },
  dishTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dishName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availText: { fontSize: 11 },
  catBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  catText: { fontSize: 10 },
  dishDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: '800',
  },
  priceDeleteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  deleteBtn: {
    paddingVertical: 3,
  },
  deleteText: {
    fontSize: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    marginBottom: 8,
    marginTop: 12,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  catChipText: {
    fontSize: 13,
  },
  categoryScroll: {
    paddingBottom: 8,
    marginBottom: 8,
  },
  photoActionsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    objectFit: 'cover',
  },
  previewPlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
  },
});
